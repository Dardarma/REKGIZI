<template>
  <AhliGiziLayout>
    <div class="min-h-screen w-full text-center bg-[#fef3e2]">
      <div class="mt-8">
        <b class="text-4xl font-[jua]" v-if="isCreate">Asuhan Baru</b>
        <b class="text-4xl font-[jua]" v-if="isEdit">Cari Asuhan Lama</b>
        <input
          placeholder="Masukan nama, alamat, email, tanggal lahir, atau alamat"
          class="m-4 h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
          v-model="search"
        />
      </div>
      <div class="mt-2">
        <tableBassic
          :headers="header"
          :rows="rows"
          :total="total"
          :currentPage="currentPage"
          :limit="limit"
          :total_pages="total_pages"
          @change="handleChange"
        >
          <template #action="{ row }">
            <button
              class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
              @click="addModal(row)"
              v-if="isCreate"
            >
              Buat Asuhan
            </button>
            <router-link
              class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
              :to="`/ahligizi/diagnosa/edit/${row.id}`"
              v-if="isEdit"
            >
              Asuhan
            </router-link>
          </template>
        </tableBassic>
      </div>
    </div>
    <Modal :dialogVisible="dialogVisible" modalTitle="Buat Asuhan baru" @close="closeModal">
      <template #body>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input type="number" placeholder="Nama" hidden v-model="form.user_id" />
            <input
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              placeholder="Nama"
              v-model="form.nama"
              disabled
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Asesment</label>
            <dateform
              v-model="form.tanggalAsesmen"
              :config="dateConfig"
              placeholder="Tanggal Lahir"
              :disabled="true"
              class="bg-gray-100"
            />
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
          @click="submitForm()"
        >
          Save
        </button>
      </template>
    </Modal>
  </AhliGiziLayout>
</template>

<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import tableBassic from '@/components/costumeComponents/common/tableBassic.vue'
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import { getAsuhanUser, postAsuhan } from '@/service/ahliGizi/diagnosa/asuhan'
import Modal from '@/components/costumeComponents/common/modal.vue'
import dateform from '@/components/costumeComponents/form input/dateform.vue'
import Swal from 'sweetalert2'
import router from '@/router'
import { useRoute } from 'vue-router'

let timer: ReturnType<typeof setTimeout>

const route = useRoute()

const total = ref(0)
const currentPage = ref(1)
const limit = ref(10)
const total_pages = ref(1)
const rows = ref<any[]>([])
const search = ref('')

const isEdit = computed(() => route.path.includes('edit'))
const isCreate = computed(() => route.path.includes('create'))


const dialogVisible = ref(false)

const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

interface User {
  id: number
  nama: string
  jenis_kelamin: string
  tanggal_lahir: string
  alamat: {
    desa: string
    kecamatan: string
    kota: string
    provinsi: string
    lengkap: string
  }
}

const form = ref({
  user_id: '',
  nama:'',
  tanggalAsesmen: '',
  status: '',
})

const header = [
  { label: 'Nama', key: 'nama' },
  { label: 'Gender', key: 'jenis_kelamin' },
  { label: 'alamat', key: 'alamat' },
  { label: 'Tanggal Lahir', key: 'tanggal_lahir' },
]

onMounted(async () => {
  await mapUser()
})

watch(search, (val) => {
  clearTimeout(timer)

  timer = setTimeout(async () => {
    currentPage.value = 1
    await mapUser(1, limit.value)
  }, 400)
})

async function mapUser(requestedPage = currentPage.value, requestedLimit = limit.value) {
  const res = await getAsuhanUser(search.value, requestedPage, requestedLimit)

  const meta = res.data?.meta
  const data = res.data?.data || []

  total.value = meta?.total ?? 0
  currentPage.value = meta?.current_page ?? 1
  limit.value = meta?.limit ?? 10
  total_pages.value = meta?.total_pages ?? 1

  rows.value = data.map((item: User) => ({
    id: item.id,
    nama: item.nama,
    jenis_kelamin: item.jenis_kelamin,
    tanggal_lahir: item.tanggal_lahir,
    alamat: item.alamat.lengkap,
  }))
}

const handleChange = async (payload: { page?: number; limit?: number }) => {
  const requestedLimit = payload.limit ?? limit.value
  const requestedPage = payload.page ?? currentPage.value
  await mapUser(requestedPage, requestedLimit)
}

function addModal(data:any) {
  form.value = {
    user_id: data.id,
    nama: data.nama,
    tanggalAsesmen: '',
    status: 'belum_ditinjau',
  }
  dialogVisible.value = true
}

async function submitForm() {
  if (!form.value.user_id || !form.value.tanggalAsesmen) {
    await Swal.fire({
      title: 'Data belum lengkap',
      text: 'Pastikan semua data sudah terisi.',
      icon: 'warning',
    })
    return
  }

  const confirm = await Swal.fire({
    title: 'Simpan data?',
    text: 'Pastikan data sudah benar sebelum disimpan.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Simpan',
    cancelButtonText: 'Batal',
  })

  if (!confirm.isConfirmed) return

  const payload = {
    pasien_id: Number(form.value.user_id),
    tanggal_assesmen: form.value.tanggalAsesmen,
    status: 'belum_ditinjau',
  }

  try {
    const res = await postAsuhan(payload)
    const rekamPasienId = res.data.id
    

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    })

    closeModal()
    router.push({
      path: `/ahligizi/diagnosa/assessment/${rekamPasienId}`,
      query: { mode: 'create', tab: 'Biodata' },
    })

  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'error',
    })
  }
}

function closeModal() {
  dialogVisible.value = false
}
</script>
