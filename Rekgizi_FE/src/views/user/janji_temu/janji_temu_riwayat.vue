<template>
  <UserLayout>
    <div class="flex items-center mb-5">
      <router-link
        to="/user/janji-temu"
        class="bg-[#FAB12F] font-[jua] text-lg px-4 py-2 rounded-xl hover:bg-[#E67300] text-center whitespace-nowrap mr-5"
      >
        <
      </router-link>
      <h1 class="text-3xl font-[jua] text-[#FA812F]">Riwayat Janji Temu</h1>
    </div>

    <div class="mx-2 my-2">
      <TableSearch
        :headers="header"
        :rows="rows"
        :total="total"
        :currentPage="currentPage"
        :limit="limit"
        :total_pages="total_pages"
        :search="search"
      >
        <template #action="{ row }">
          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
              @click="openModal(row)"
          >
            <Eye class="w-6 h-6" />
          </button>
          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
            @click="deleteJadwal(row)"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
        </template>
      </TableSearch>
    </div>
    <Modal
      :dialogVisible="dialogVisible"
      modalTitle="Detail Janji Temu"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          <div>
            <p class="font-[jua] text-lg">
              Ahligizi : {{ formJadwal.nama_konselor }}
            </p>
            <p class="font-[jua] text-lg">
              Tanggal : {{ formJadwal.tanggal_konseling }}
            </p>
            <p class="font-[jua] text-lg">
              Jam : {{ formJadwal.start_time }} - {{ formJadwal.end_time }}
            </p>
            <p class="font-[jua] text-lg">
              Status : {{ formJadwal.status }}
            </p>
            <p class="font-[jua] text-lg">
              Catatan : {{ formJadwal.catatan }}
            </p>
          </div>
        </div>
      </template>
      <template #button>
        <button
          type="button"
          class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300]"
          @click="closeModal"
        >
          Ok
        </button>
      </template>
    </Modal>
  </UserLayout>
</template>
<script setup lang="ts">
import UserLayout from '@/components/layout/user/UserLayout.vue'
import { onMounted, ref } from 'vue'
import TableSearch from '@/components/costumeComponents/common/tableSearch.vue'
import { TrashIcon } from '@/icons/index'
import { deleteJanjiTemu, getJanjiTemu } from '@/service/ahliGizi/janjitemu/janji_temu'
import Eye from '@/icons/customeIcon/eye.vue'
import Modal from '@/components/costumeComponents/common/modal.vue'
import Swal from 'sweetalert2'

const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const total_pages = ref(1)
const rows = ref<any[]>([])
const search = ref('')

const dialogVisible = ref(false)

const closeModal = () => {
  dialogVisible.value = false
}


const header = [
  { label: 'Ahli Gizi', key: 'ahli_gizi' },
  { label: 'Tanggal', key: 'tanggal' },
  { label: 'Jam', key: 'jam' },
  { label: 'Status', key: 'status' },
]



interface Jadwal {
  id: number
  pasien_id: number
  konselor_id: number
  nama_konselor: string
  nama_pasien: string
  jadwal_tersedia_id: number
  tanggal_konseling: string
  day_of_week: string
  start_time: string
  end_time: string
  status: string
  catatan: string
}

const formJadwal = ref<Jadwal>({
  id: 0,
  pasien_id: 0,
  konselor_id: 0,
  nama_konselor: '',
  nama_pasien: '',
  jadwal_tersedia_id: 0,
  tanggal_konseling: '',
  day_of_week: '',
  start_time: '',
  end_time: '',
  status: '',
  catatan: '',
})

function openModal(data: Jadwal) {
  formJadwal.value.id = data.id
  formJadwal.value.pasien_id = data.pasien_id
  formJadwal.value.konselor_id = data.konselor_id
  formJadwal.value.nama_konselor = data.nama_konselor
  formJadwal.value.nama_pasien = data.nama_pasien
  formJadwal.value.jadwal_tersedia_id = data.jadwal_tersedia_id
  formJadwal.value.tanggal_konseling = data.tanggal_konseling
  formJadwal.value.day_of_week = data.day_of_week
  formJadwal.value.start_time = data.start_time
  formJadwal.value.end_time = data.end_time
  formJadwal.value.status = data.status
  formJadwal.value.catatan = data.catatan
  dialogVisible.value = true
}

onMounted(()=> {
  mapJanjiTemu()
})


async function mapJanjiTemu(){
  const res = await getJanjiTemu(search.value, currentPage.value, limit.value)
  const data = res.data || []

  total.value = res.total ?? 0
  total_pages.value = res.total_pages ?? 1
  limit.value = res.limit ?? 10
  currentPage.value = res.current_page ?? 1

  rows.value = data.map((item: Jadwal)=> ({
    ...item,
    id: item.id,
    ahli_gizi: item.nama_konselor,
    tanggal: item.tanggal_konseling,
    jam: item.start_time + ' - ' + item.end_time,
    status: item.status,
  }))

}

async function deleteJadwal(data: Jadwal) {
  const result = await Swal.fire({
    title: 'Hapus Janji Temu',
    text: `Apakah kamu yakin ingin menghapus janji temu pada ${data.tanggal_konseling}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    await deleteJanjiTemu(data.id)
    await mapJanjiTemu()
    Swal.fire({
      title: 'Berhasil',
      text: 'Janji temu berhasil dihapus',
      icon: 'success',
    })
  } catch (error: any) {
    Swal.fire({
      title: 'Gagal',
      text: error.response?.data?.message || 'Janji temu gagal dihapus',
      icon: 'error',
    })
  }
}


</script>
