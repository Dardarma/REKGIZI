<template>
  <UserLayout>
    <div class="flex justify-between items-center mb-5">
      <h1 class="text-3xl font-[jua] text-[#FA812F]">Janji Temu</h1>

      <router-link
        to="/user/janji-temu/riwayat"
        class="bg-[#FAB12F] font-[jua] text-lg px-4 py-2 rounded-xl hover:bg-[#E67300] text-center whitespace-nowrap"
      >
        Riwayat Janji Temu
      </router-link>
    </div>

    <div v-for="{ day, jadwalList } in orderedJadwalTersedia" :key="day" class="mb-8">
      <h2 class="text-2xl font-[jua] text-gray-800 mb-4 capitalize">Hari {{ day }}</h2>
      <div class="flex flex-wrap gap-5">
        <div
          v-for="item in jadwalList"
          :key="item.id"
          class="w-[320px] min-h-[6.25rem] bg-[#EAD3AF] shadow-lg rounded-lg p-5 flex flex-col justify-between"
        >
          <div class="mb-4">
            <p class="font-[jua] text-lg mb-1">{{ item.konselor_nama }}</p>
            <p class="font-[jua] text-2xl uppercase">{{ item.day_of_week }}</p>
            <p class="font-[jua] text-2xl uppercase">{{ formatTanggal(item.tanggal) }}</p>
            <p class="font-[jua] text-lg mb-1">
              {{ formatJam(item.start_time) }} - {{ formatJam(item.end_time) }}
            </p>
          </div>

          <button
            type="button"
            class="bg-[#FAB12F] font-[jua] text-xl px-4 py-2 rounded-xl hover:bg-[#E67300] self-center text-center w-full transition-colors duration-200"
            :disabled="item.status === 'tutup'"
            :class="{ 'opacity-50 cursor-not-allowed': item.status === 'tutup' }"
            @click="addJadwalSubmit(item)"
          >
            {{ item.status === 'tutup' ? 'Tutup' : 'Ajukan Jadwal' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="orderedJadwalTersedia.length === 0" class="text-gray-500 font-[jua]">
      Belum ada jadwal tersedia.
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import UserLayout from '@/components/layout/user/UserLayout.vue'
import { computed, ref, onMounted } from 'vue'
import { getAllJadwalTersedia } from '@/service/ahliGizi/janjitemu/janjitersedia'
import { formatJam } from '@/utils/formatJam'
import Swal from 'sweetalert2'
import { addJadwal } from '@/service/ahliGizi/janjitemu/janji_temu'
import { formatTanggal } from '@/utils/formatTanggal'

const jadwalTersedia = ref<Record<string, any[]>>({})
const pasien_id = localStorage.getItem('id')
const dayOrder = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']

const orderedJadwalTersedia = computed(() => {
  const todayIndex = new Date().getDay()
  const orderedDays = [...dayOrder.slice(todayIndex), ...dayOrder.slice(0, todayIndex)]

  return orderedDays
    .filter((day) => jadwalTersedia.value[day]?.length)
    .map((day) => ({
      day,
      jadwalList: [...jadwalTersedia.value[day]].sort((a, b) => {
        const dateCompare = String(a.tanggal).localeCompare(String(b.tanggal))
        if (dateCompare !== 0) return dateCompare

        return String(a.start_time).localeCompare(String(b.start_time))
      }),
    }))
})
onMounted(async () => {
  await fetchJadwal()
})

async function fetchJadwal() {
  try {
    const res = await getAllJadwalTersedia()
    if (res && res.data && res.data.jadwal_tersedia) {
      jadwalTersedia.value = res.data.jadwal_tersedia
    }
  } catch (error) {
    console.error('Gagal mengambil data jadwal tersedia:', error)
  }
}

async function addJadwalSubmit(data: any) {
  try {
    const payload = {
      pasien_id: Number(pasien_id),
      konselor_id: data.konselor_id,
      jadwal_tersedia_id: data.id,
      tanggal_konseling: data.tanggal,
      status: "pending",
    }
    await Swal.fire({
      title: 'Ajukan Jadwal',
      text:
        'Apakah kamu yakin ingin mengajukan jadwal pada ' +
        data.konselor_nama +
        ' pada hari ' +
        data.day_of_week +
        ' pada jam ' +
        formatJam(data.start_time) +
        ' - ' +
        formatJam(data.end_time) +
        '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then(async(result) => {
      if (result.isConfirmed) {
        await addJadwal(payload)
        await fetchJadwal()
        Swal.fire({
          title: 'Berhasil mengajukan jadwal',
          text: 'Berhasil mengajukan jadwal',
          icon: 'success',
          confirmButtonText: 'Tutup',
        })
      }
    })
  } catch (error: any) {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      'Gagal mengajukan jadwal'

    Swal.fire({
      title: 'Gagal mengajukan jadwal',
      text: message,
      icon: 'error',
      confirmButtonText: 'Tutup',
    })
  }
}
</script>
