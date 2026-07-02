<template>
  <UserLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Rekam medis</h1>

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
            @click="detail(row.id)"
          >
            <Eye class="w-6 h-6" />
          </button>
        </template>
      </TableSearch>
    </div>

  </UserLayout>
</template>
<script setup lang="ts">
import UserLayout from '@/components/layout/user/UserLayout.vue'
import { onMounted, ref } from 'vue'
import TableSearch from '@/components/costumeComponents/common/tableSearch.vue'
import Eye from '@/icons/customeIcon/eye.vue'
import {getRekamMedis} from '@/service/user/rekamMedisList'
import { formatTanggal } from '@/utils/formatTanggal'
import router from '@/router'


const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const total_pages = ref(1)
const rows = ref<any[]>([])
const search = ref('')

onMounted(async () => {
  mapRekamPasien()
})

const header = [
  { label: 'Tanggal Asesment', key: 'tanggal' },
  { label: 'Jenis Diet', key: 'jenis_diet' },
  
]
interface RekamPasien {
   id: number,
   pasien_id: number,
   nama_pasien: string,
   tanggal_asesmen: string,
   status: string,
   intervensi_id: number,
   tujuan_intervensi: string,
   prinsip_intervensi: string,
   edukasi_intervensi: string,
   karbohidrat: number,
   protein: number,
   energi: number,
   jenis_diet: string
}

async function mapRekamPasien(){
  const res = await getRekamMedis(search.value, currentPage.value, limit.value)
  const data = res.data || []

  total.value = res?.total ?? 0
  total_pages.value = res.total_pages ?? 1
  limit.value = res.limit ?? 10
  currentPage.value = res.current_page ?? 1

  rows.value = data.map((item: RekamPasien)=> ({
    ...item,
    id: item.id,
    tanggal: formatTanggal( item.tanggal_asesmen),
    jenis_diet: item.jenis_diet
  }))
}

function detail(id: number){
  router.push(`/user/rekam-medis/${id}`)
}
</script>
