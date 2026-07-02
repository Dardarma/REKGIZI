<template>
  <ContainerConten title="Jadwal Janji Temu">
    <template #Button>
      <button
        class="bg-[#FA812F] text-white px-3 py-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
        @click="openAddModal"
      >
        Add New
      </button>
    </template>
    <div
      v-if="jadwalTersedia.length === 0"
      class="container mx-auto mt-4 rounded-md bg-[#EAD3AF] p-3 flex items-center gap-3"
    >
      <p>Belum ada jadwal tersedia</p>
    </div>
    <div
      v-else
      v-for="item in jadwalTersedia"
      :key="item.id"
      class="container mx-auto mt-4 rounded-md bg-[#EAD3AF] p-3 flex items-center gap-3"
    >
      <!-- Nama + Status -->
      <div class="w-[150px] font-[jua] min-w-0">
        <h1 class="text-2xl">{{ item.day_of_week }}</h1>
      </div>

      <div class="w-[150px] text-center flex-none">
        <p>{{ formatJam(item.start_time) }} - {{ formatJam(item.end_time) }}</p>
      </div>

      <div class="flex-none justify-end ml-auto">
        <button
          class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          @click="editJadwal(item)"
        >
          <Pencil class="w-6 h-6" />
        </button>

        <button
          class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          @click="deleteJadwal(item.id)"
        >
          <TrashIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  </ContainerConten>

  <Modal
    :dialogVisible="dialogJadwal"
    :modalTitle="mode === 'add' ? 'Tambah Jadwal' : 'Edit Jadwal'"
    @close="closeModal"
  >
    <template #body>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <flat-pickr
            v-model="formJadwal.start_time"
            :config="timePickerConfig"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
            placeholder="Select start time"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <flat-pickr
            v-model="formJadwal.end_time"
            :config="timePickerConfig"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
            placeholder="Select end time"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
          <select
            v-model="formJadwal.day_of_week"
            class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
          >
            <option value="" disabled class="font-[jua]">Select</option>
            <option value="Senin" class="font-[jua]">Senin</option>
            <option value="Selasa" class="font-[jua]">Selasa</option>
            <option value="Rabu" class="font-[jua]">Rabu</option>
            <option value="Kamis" class="font-[jua]">Kamis</option>
            <option value="Jumat" class="font-[jua]">Jumat</option>
          </select>
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
        @click="submitJadwal()"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import ContainerConten from '@/components/costumeComponents/dashboard/containerConten.vue'
import { Pencil } from '@/icons/customeIcon'
import { TrashIcon } from '@/icons/index'
import Modal from '@/components/costumeComponents/common/modal.vue'
import { ref, onMounted } from 'vue'
import {
  getJadwalTersedia,
  editJadwalTersedia,
  addJadwalTersedia,
  deleteJadwalTersedia,
} from '@/service/ahliGizi/janjitemu/janjitersedia'
import { formatJam } from '@/utils/formatJam'
import Swal from 'sweetalert2'
import flatPickr from 'vue-flatpickr-component'

const timePickerConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
}

const dialogJadwal = ref(false)
const mode = ref<'add' | 'edit'>('add')
const selectedId = ref<number | null>(null)
const userId = localStorage.getItem('id')
const jadwalTersedia = ref<jadwalTersedia[]>([])

interface jadwalTersedia {
  id: number
  konselor_id: number
  day_of_week: string
  start_time: string
  end_time: string
}

const formJadwal = ref({
  start_time: '',
  end_time: '',
  day_of_week: '',
})

function openAddModal() {
  mode.value = 'add'
  formJadwal.value = {
    start_time: '',
    end_time: '',
    day_of_week: '',
  }
  dialogJadwal.value = true
}

function editJadwal(jadwal: any) {
  mode.value = 'edit'
  selectedId.value = jadwal.id
  formJadwal.value = {
    start_time: jadwal.start_time,
    end_time: jadwal.end_time,
    day_of_week: jadwal.day_of_week,
  }

  dialogJadwal.value = true
}

async function submitJadwal() {
  try {
    const payload = {
      start_time: formJadwal.value.start_time,
      end_time: formJadwal.value.end_time,
      day_of_week: formJadwal.value.day_of_week,
      konselor_id: userId,
    }

    if (mode.value === 'add') {
      await addJadwalTersedia(payload)
    } else if (selectedId.value !== null) {
      await editJadwalTersedia(payload, selectedId.value)
    }

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })

    closeModal()
    jadwalTersediaMapping()
  } catch (error: any) {
    Swal.fire({
      title: 'ERROR',
      text: error.response?.data?.detail || error.response?.data?.message || 'Terjadi kesalahan',
      icon: 'warning',
    })

    console.error(error.response?.data)
  }
}

function closeModal() {
  dialogJadwal.value = false
  formJadwal.value = {
    start_time: '',
    end_time: '',
    day_of_week: '',
  }
}

onMounted(() => {
  jadwalTersediaMapping()
})

async function jadwalTersediaMapping() {
  const data = await getJadwalTersedia()
  jadwalTersedia.value = data.data.map((item: jadwalTersedia) => ({
    id: item.id,
    konselor_id: item.konselor_id,
    day_of_week: item.day_of_week,
    start_time: item.start_time,
    end_time: item.end_time,
  }))
}

async function deleteJadwal(id: number) {
  try {
    await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data akan dihapus secara permanen',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await deleteJadwalTersedia(id)
      }
    })

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil dihapus',
      icon: 'success',
    })
    await jadwalTersediaMapping()
  } catch (error: any) {
    Swal.fire({
      title: 'ERROR',
      text: error.response?.data?.detail || error.response?.data?.message || 'Terjadi kesalahan',
      icon: 'warning',
    })

    console.error(error.response?.data)
  }
}
</script>
