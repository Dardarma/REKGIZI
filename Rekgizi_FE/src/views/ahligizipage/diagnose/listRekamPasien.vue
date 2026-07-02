<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Rekam Pasien</h1>

    <div class="mx-2 my-2">
      <TableMaster :headers="header" :rows="rows">
        <template #action="{ row }">
            <router-link
            :to="{ path: `/ahligizi/diagnosa/assessment/${row.id}`, query: { mode: 'edit' } }"
            class="inline-flex items-center justify-center bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          >
            <Eye class="w-6 h-6" />
          </router-link>
        </template>
      </TableMaster>
    </div>
  </AhliGiziLayout>
</template>
<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import TableMaster from '@/components/costumeComponents/common/tableMaster.vue'
import { onMounted, ref } from 'vue'
import Eye from '@/icons/customeIcon/eye.vue'
import { getRekamPasienbyUser } from '@/service/ahliGizi/diagnosa/asuhan'
import { useRoute } from 'vue-router'
import { formatTanggal } from '@/utils/formatTanggal'

const route = useRoute()
const id_user = Number(route.params.id)
const rows = ref([])

interface RekamPasien {
  id: number
  nama_pasien: string
  tanggal_asesmen: Date
  status: string
}


onMounted(async () => {
  mapRekamPasien()
})

async function mapRekamPasien() {
  const rekamPasien = await getRekamPasienbyUser(id_user)

  rows.value =
    rekamPasien.data.map((item: RekamPasien) => ({
      id: item.id,
      nama_pasien: item.nama_pasien,
      tanggal_asesmen: formatTanggal(item.tanggal_asesmen),
      status: item.status,
    })) ?? []
}


const header = [
 {label:"nama", key:"nama_pasien"},
 {label:"Tanggal Asuhan", key:"tanggal_asesmen"},
 {label:"Status", key:"status"}
 
]
</script>
