<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Buat Janji Temu</h1>

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
            <Pencil class="w-6 h-6" />
          </button>

          <button
            class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          >
            <TrashIcon class="w-6 h-6" />
          </button>
        </template>
      </TableSearch>
    </div>

    <Modal
      :dialogVisible="dialogVisible"
      modalTitle="Ubah Status"
      @close="closeModal"
    >
      <template #body>
        <div class="space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pasien</label>
            <input
              type="text"
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              placeholder="Nama Pasien"
              v-model="form.nama_pasien"
              disabled
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              placeholder="Status"
              v-model="form.status"
            >
              <option value="" disabled selected>Pilih status</option>
              <option value="pending">Pending</option>
              <option value="approved">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              placeholder="Catatan"
              rows="3"
              v-model="form.catatan"
            ></textarea>
          </div>
        </div>
      </template>
      <template #button>
        <button
          type="button"
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
          @click="closeModal"
        >
          Cancel
        </button>

        <button
          type="button"
          class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300]"
          @click="updateJadwal"
        >
          Save
        </button>
      </template>
    </Modal>
  </AhliGiziLayout>
</template>
<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import Modal from '@/components/costumeComponents/common/modal.vue'
import { Pencil } from '@/icons/customeIcon'
import { onMounted, ref } from 'vue'
import { TrashIcon } from '@/icons/index'
import TableSearch from '@/components/costumeComponents/common/tableSearch.vue'
import Swal from 'sweetalert2'
import { getJanjiTemu, updateStatusJanjiTemu } from '@/service/ahliGizi/janjitemu/janji_temu'

const dialogVisible = ref(false)
const selectedId = ref<number | null>(null)

const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const total_pages = ref(1)
const rows = ref<any[]>([])
const search = ref('')

function closeModal() {
  dialogVisible.value = false
}

const header = [
  { label: 'Pasein', key: 'nama_pasien' },
  { label: 'Tanggal', key: 'tanggal_konseling' },
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

async function updateJadwal() {
  try {
     selectedId.value = form.value.id
  if (selectedId.value === null) return

  const payload = {
    status: form.value.status,
    catatan: form.value.catatan,
  }

  const data = await updateStatusJanjiTemu(selectedId.value, payload)

   Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil diubah',
      icon: 'success',
    })
    mapJadwal()
    closeModal()
  } catch (error) {
    Swal.fire({
      title: 'Gagal',
      text: 'Data gagal diubah',
      icon: 'error',
    })
  }
 
}

async function mapJadwal() {
  const res = await getJanjiTemu(search.value, currentPage.value, limit.value)
  const data = res.data || []

  total.value = res.total ?? 0
  total_pages.value = res.total_pages ?? 1
  limit.value = res.limit ?? 10
  currentPage.value = res.current_page ?? 1

  rows.value = data.map((item: Jadwal)=> ({
    ...item,
   id: item.id,
   nama_pasien : item.nama_pasien,
   tanggal_konseling : item.tanggal_konseling,
   jam : item.start_time + ' - ' + item.end_time,
   status : item.status,
  }))

}

const form = ref<{
  id: number | null;
  nama_pasien: string;
  status: string;
  catatan: string;
}>({
  id: null,
  nama_pasien: '',
  status: '',
  catatan: '',
})

function openModal(item: Jadwal) {
  form.value.id = item.id
  form.value.nama_pasien = item.nama_pasien
  form.value.status = item.status
  form.value.catatan = item.catatan
  dialogVisible.value = true
}

onMounted(() => {
  mapJadwal()
})

</script>
