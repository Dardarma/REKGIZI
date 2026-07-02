<template>
  <UserLayout>
    <ContainerConten title="Janji Temu" class="my-4">
      <div class="flex overflow-x-auto gap-4 w-full pb-0 mx-1">
        <janjiTemuCard
          v-for="item in dataJanjiTemu"
          :key="item.id"
          :date="formatTanggal(item.tanggal_konseling) "
          :location="item.nama_konselor"
          :status="item.status"
          :time="item.start_time"
          @click="clickJanjiTemu()"
          class="flex-shrink-0 mb-3"
        ></janjiTemuCard>
      </div>
    </ContainerConten>
    <ContainerConten title="Hasil Intervensi">
      <div class="gap-4 w-full scrollbar-hide pb-0 mx-1">
        <Card_intervensi_user
        v-for="item in dataIntervensi"
        :key="item.id"
        :jenis_diet="item.jenis_diet"
        :tanggal="formatTanggal(item.tanggal_asesmen)"
        :tujuan="item.tujuan_intervensi"
        :prinsip="item.prinsip_intervensi"
        :energi="item.energi"
        :protein="item.protein"
        :karbohidrat="item.karbohidrat"
        class="my-4"
        @click="clickIntervensi(item.id)"
        ></Card_intervensi_user>
      </div>
    </ContainerConten>
  </UserLayout>
</template>
<script setup lang="ts">
import { ref,onMounted } from 'vue'
import UserLayout from '@/components/layout/user/userLayout.vue'
import ContainerConten from '@/components/costumeComponents/dashboard/containerConten.vue'
import janjiTemuCard from '@/components/costumeComponents/dashboard/janjiTemuCard.vue'
import Card_intervensi_user from '@/components/costumeComponents/dashboard/card_intervensi_user.vue'
import Swal from 'sweetalert2'
import { getIntervensi, getJanjiTemu } from '@/service/user/dasboard'
import { useRouter } from 'vue-router'
import { formatTanggal } from '@/utils/formatTanggal'

const router = useRouter()

interface JanjiTemu {
  id: number,
  tanggal_konseling: string,
  status: string,
  nama_konselor: string,
  day_of_week: string,
  start_time: string,
  jadwal_tersedia_id: number
}

interface Intervensi {
  id: 0,
  nama_pasien: string,
  tanggal_asesmen: string,
  status: string,
  jenis_diet: string,
  karbohidrat: number,
  protein: number,
  energi: number,
  edukasi_intervensi: string
  tujuan_intervensi: string,
  prinsip_intervensi: string
}

const dataJanjiTemu = ref<JanjiTemu[]>([])
const dataIntervensi = ref<Intervensi[]>([])


onMounted(() => {
  fetchJanjiTemu()
  fetchIntervensi()
})


async function fetchJanjiTemu(){
  try{
    const res = await getJanjiTemu()
    dataJanjiTemu.value = res.data
    console.log(dataJanjiTemu.value)
  }catch(error){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch janji temu data.',
    })
  }
}

async function fetchIntervensi(){
  try{
    const res = await getIntervensi()
    dataIntervensi.value = res.data
  }catch(error){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to fetch janji temu data.',
    })
  }
}

function clickJanjiTemu(){
  router.push(`/user/janji-temu/riwayat`)
}

function clickIntervensi(id: number){
  router.push(`/user/rekam-medis/${id}`)
}
</script>
