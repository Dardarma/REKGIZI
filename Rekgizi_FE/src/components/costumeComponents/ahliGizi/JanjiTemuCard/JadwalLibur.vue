<template>
  <ContainerConten title="Jadwal Libur">
    <template #Button>
      <button
        class="bg-[#FA812F] text-white px-3 py-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
        @click="addModal()"
      >
        Add New
      </button>
    </template>
    <div
      v-if="jadwalLibur.length === 0"
      class="container mx-auto mt-4 rounded-md bg-[#EAD3AF] p-3 flex items-center gap-3"
    >
      <p>Belum ada jadwal libur</p>
    </div>
    <div
      v-for="item in jadwalLibur"
      :key="item.id"
      class="container mx-auto mt-4 rounded-md bg-[#EAD3AF] p-3 flex items-center gap-3"
    >
      <div class="w-[150px] font-[jua] min-w-0">
        <h1 class="text-2xl">{{ item.day_of_week }}</h1>
      </div>

      <div class="w-[150px] text-center flex-none">
        <p>{{ item.start_time }} - {{ item.end_time }}</p>
        <p>
          {{ item.tanggal }}
        </p>
      </div>

      <div class="flex-none justify-end ml-auto">
        <button
          class="bg-[#FA812F] text-white px-1 py-1 mx-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          @click="deleteLibur(item.id)"
        >
          <TrashIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  </ContainerConten>

  <Modal :dialogVisible="dialogLibur" modalTitle="Tambah Libur" @close="closeModal">
    <template #body>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cakupan Libur</label>
          <div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <button
              type="button"
              class="rounded-lg border px-4 py-3 text-left font-[jua] transition"
              :class="formJadwalLibur.mode === 'one' ? 'border-[#FA812F] bg-[#FFF3E8] text-[#B45309]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
              @click="setHolidayMode('one')"
            >
              <span class="block text-sm">Satu Jadwal</span>
              <span class="mt-1 block text-xs font-normal text-gray-500">Pilih jadwal, lalu pilih satu tanggal sesuai harinya.</span>
            </button>
            <button
              type="button"
              class="rounded-lg border px-4 py-3 text-left font-[jua] transition"
              :class="formJadwalLibur.mode === 'time_range' ? 'border-[#FA812F] bg-[#FFF3E8] text-[#B45309]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
              @click="setHolidayMode('time_range')"
            >
              <span class="block text-sm">Range Jam</span>
              <span class="mt-1 block text-xs font-normal text-gray-500">Pilih range jam, lalu pilih rentang tanggal.</span>
            </button>
            <button
              type="button"
              class="rounded-lg border px-4 py-3 text-left font-[jua] transition"
              :class="formJadwalLibur.mode === 'all' ? 'border-[#FA812F] bg-[#FFF3E8] text-[#B45309]' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
              @click="setHolidayMode('all')"
            >
              <span class="block text-sm">Semua Jadwal</span>
              <span class="mt-1 block text-xs font-normal text-gray-500">Semua jadwal pada tanggal yang dipilih.</span>
            </button>
          </div>
        </div>
        <div v-if="formJadwalLibur.mode === 'one'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Jadwal</label>
          <select
            class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            v-model.number="formJadwalLibur.jadwal_tersedisa_id"
          >
            <option :value="null" disabled class="font-[jua]">Pilih jadwal</option>
            <option
              v-for="item in jadwalTersedia"
              :key="item.id"
              :value="item.id"
              class="font-[jua]"
            >
              {{ item.day_of_week }} - {{ formatJam(item.start_time) }} -
              {{ formatJam(item.end_time) }}
            </option>
          </select>
        </div>
        <div v-if="formJadwalLibur.mode === 'time_range'" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
            <flat-pickr
              v-model="formJadwalLibur.start_time"
              :config="timePickerConfig"
              class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
              placeholder="Pilih jam mulai"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
            <flat-pickr
              v-model="formJadwalLibur.end_time"
              :config="timePickerConfig"
              class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
              placeholder="Pilih jam selesai"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ dateLabel }}</label>
          <flat-pickr
            :key="datePickerKey"
            v-model="formJadwalLibur.rentang_tanggal"
            :config="datePickerConfig"
            class="h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            :placeholder="datePlaceholder"
          />
          <p class="mt-1 text-xs text-gray-500">
            {{ dateHelpText }}
          </p>
        </div>
        <div
          v-if="formJadwalLibur.rentang_tanggal"
          class="rounded-lg border p-3 text-sm font-[jua]"
          :class="holidayPreview.items.length > 0 ? 'border-[#FAB12F] bg-[#FFF8E8] text-gray-700' : 'border-red-200 bg-red-50 text-red-700'"
        >
          <p class="font-semibold">{{ holidayPreview.title }}</p>
          <ul v-if="holidayPreview.items.length > 0" class="mt-2 space-y-1 text-xs text-gray-600">
            <li v-for="item in holidayPreview.items.slice(0, 4)" :key="item">
              {{ item }}
            </li>
          </ul>
          <p v-if="holidayPreview.hiddenCount > 0" class="mt-1 text-xs text-gray-500">
            +{{ holidayPreview.hiddenCount }} jadwal lainnya
          </p>
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
        @click="submitJadwalLibur"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import ContainerConten from '@/components/costumeComponents/dashboard/containerConten.vue'
import { TrashIcon } from '@/icons/index'
import Modal from '@/components/costumeComponents/common/modal.vue'
import { ref, onMounted, computed } from 'vue'
import {
  getJadwalLibur,
  deleteJadwalLibur,
  createJadwalLibur,
} from '@/service/ahliGizi/janjitemu/jadwal_libur'
import { getJadwalTersedia } from '@/service/ahliGizi/janjitemu/janjitersedia'
import Swal from 'sweetalert2'
import { formatJam } from '@/utils/formatJam'
import flatPickr from 'vue-flatpickr-component'

const dialogLibur = ref(false)
const jadwalLibur = ref<jadwalLibur[]>([])
const jadwalTersedia = ref<jadwalTersedia[]>([])

interface jadwalLibur {
  id: number
  day_of_week: string
  start_time: string
  end_time: string
  tanggal: string
}

interface jadwalTersedia {
  id: number
  konselor_id: number
  day_of_week: string
  start_time: string
  end_time: string
}

async function addModal() {
  dialogLibur.value = true
  await jadwalTersediaMapping()
  formJadwalLibur.value.jadwal_tersedisa_id = jadwalTersedia.value[0]?.id ?? null
}

const formJadwalLibur = ref({
  mode: 'one' as 'one' | 'time_range' | 'all',
  jadwal_tersedisa_id: null as number | null,
  rentang_tanggal: '',
  start_time: '',
  end_time: '',
})

const timePickerConfig = {
  enableTime: true,
  noCalendar: true,
  dateFormat: 'H:i',
  time_24hr: true,
}

const datePickerConfig = computed(() => ({
  mode: formJadwalLibur.value.mode === 'one' ? 'single' as const : 'range' as const,
  dateFormat: 'Y-m-d',
  minDate: 'today',
  disable:
    formJadwalLibur.value.mode === 'one'
      ? [
          function (date: Date) {
            const scheduleDay = selectedScheduleDayIndex.value
            if (scheduleDay === null) return true
            return date.getDay() !== scheduleDay
          },
        ]
      : [],
}))

const dayOfWeekMap: Record<string, number> = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
}

const selectedSchedule = computed(() => {
  if (formJadwalLibur.value.mode !== 'one') return null
  return jadwalTersedia.value.find((item) => item.id === formJadwalLibur.value.jadwal_tersedisa_id) || null
})

const selectedScheduleDayIndex = computed(() => {
  if (!selectedSchedule.value) return null
  return dayOfWeekMap[String(selectedSchedule.value.day_of_week).trim().toLowerCase()] ?? null
})

const datePickerKey = computed(() => {
  return `${formJadwalLibur.value.mode}-${formJadwalLibur.value.jadwal_tersedisa_id || 'all'}`
})

const dateLabel = computed(() => formJadwalLibur.value.mode === 'one' ? 'Tanggal' : 'Rentang Tanggal')
const datePlaceholder = computed(() => formJadwalLibur.value.mode === 'one' ? 'Pilih tanggal' : 'Pilih rentang tanggal')
const dateHelpText = computed(() => {
  if (formJadwalLibur.value.mode === 'one') {
    return 'Tanggal hanya bisa dipilih sesuai hari dari jadwal tersebut dan tidak boleh kurang dari hari ini.'
  }
  if (formJadwalLibur.value.mode === 'time_range') {
    return 'Pilih satu tanggal atau rentang tanggal. Jadwal yang waktunya overlap dengan range jam akan diliburkan.'
  }
  return 'Pilih satu tanggal atau rentang tanggal untuk meliburkan semua jadwal pada hari tersebut.'
})

const holidayPreview = computed(() => {
  const schedules = getMatchingHolidaySchedules()
  const visibleItems = schedules.map(
    (item) => `${item.tanggal} - ${item.day_of_week} ${formatJam(item.start_time)} - ${formatJam(item.end_time)}`,
  )

  if (!formJadwalLibur.value.rentang_tanggal) {
    return { title: 'Pilih tanggal terlebih dahulu', items: [], hiddenCount: 0 }
  }

  if (formJadwalLibur.value.mode === 'one' && !selectedSchedule.value) {
    return { title: 'Pilih jadwal yang ingin diliburkan', items: [], hiddenCount: 0 }
  }

  if (formJadwalLibur.value.mode === 'time_range' && (!formJadwalLibur.value.start_time || !formJadwalLibur.value.end_time)) {
    return { title: 'Isi range jam terlebih dahulu', items: [], hiddenCount: 0 }
  }

  if (visibleItems.length === 0) {
    const dayText = selectedSchedule.value?.day_of_week
    return {
      title: dayText
        ? `Rentang ini belum memuat hari ${dayText} untuk jadwal yang dipilih`
        : 'Tidak ada jadwal tersedia dalam rentang tanggal ini',
      items: [],
      hiddenCount: 0,
    }
  }

  return {
    title: `${visibleItems.length} jadwal akan diliburkan`,
    items: visibleItems,
    hiddenCount: Math.max(visibleItems.length - 4, 0),
  }
})

function setHolidayMode(mode: 'one' | 'time_range' | 'all') {
  formJadwalLibur.value.mode = mode
  formJadwalLibur.value.jadwal_tersedisa_id = mode === 'one' ? (jadwalTersedia.value[0]?.id ?? null) : null
  formJadwalLibur.value.rentang_tanggal = ''
  formJadwalLibur.value.start_time = ''
  formJadwalLibur.value.end_time = ''
}

function closeModal() {
  dialogLibur.value = false
  formJadwalLibur.value = {
    mode: 'one',
    jadwal_tersedisa_id: null,
    rentang_tanggal: '',
    start_time: '',
    end_time: '',
  }
}

onMounted(() => {
  jadwalLiburMapping()
})

async function jadwalLiburMapping() {
  try {
    const data = await getJadwalLibur()
    jadwalLibur.value = data.data.map((item: jadwalLibur) => ({
      id: item.id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      tanggal: item.tanggal,
    }))
  } catch (error: any) {
    if (error.response?.status === 404) {
      jadwalLibur.value = []
      return
    }
    throw error
  }
}

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

async function deleteLibur(id: number) {
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
        await deleteJadwalLibur(id)
      }
    })

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil dihapus',
      icon: 'success',
    })
    await jadwalLiburMapping()
  } catch (error: any) {
    Swal.fire({
      title: 'ERROR',
      text: error.response?.data?.detail || error.response?.data?.message || error.message || 'Terjadi kesalahan',
      icon: 'warning',
    })

    console.error(error.response?.data)
  }
}

async function submitJadwalLibur() {
  try {
    const [tanggalMulai, tanggalSelesai] = parseDateRange(formJadwalLibur.value.rentang_tanggal)
    const matchingSchedules = getMatchingHolidaySchedules()

    if (formJadwalLibur.value.mode === 'one' && !formJadwalLibur.value.jadwal_tersedisa_id) {
      throw new Error('Pilih jadwal yang ingin diliburkan')
    }
    if (formJadwalLibur.value.mode === 'time_range' && (!formJadwalLibur.value.start_time || !formJadwalLibur.value.end_time)) {
      throw new Error('Range jam wajib diisi')
    }

    if (matchingSchedules.length === 0) {
      throw new Error(holidayPreview.value.title)
    }

    const payload = {
      jadwal_tersedia_id:
        formJadwalLibur.value.mode === 'one' ? formJadwalLibur.value.jadwal_tersedisa_id : null,
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      start_time: formJadwalLibur.value.mode === 'time_range' ? formJadwalLibur.value.start_time : null,
      end_time: formJadwalLibur.value.mode === 'time_range' ? formJadwalLibur.value.end_time : null,
    }
    await createJadwalLibur(payload)
    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })
    closeModal()
    jadwalLiburMapping()
  } catch (error: any) {
    Swal.fire({
      title: 'ERROR',
      text: error.response?.data?.detail || error.response?.data?.message || error.message || 'Terjadi kesalahan',
      icon: 'warning',
    })

    console.error(error.response?.data)
  }
}

function parseDateRange(value: string) {
  const dates = value.split(' to ').map((item) => item.trim()).filter(Boolean)
  const startDate = dates[0]
  const endDate = dates[1] || dates[0]

  if (!startDate) {
    throw new Error('Rentang tanggal wajib dipilih')
  }

  return [startDate, endDate]
}

function getMatchingHolidaySchedules() {
  if (!formJadwalLibur.value.rentang_tanggal) return []

  let dateRange: string[]
  try {
    dateRange = parseDateRange(formJadwalLibur.value.rentang_tanggal)
  } catch {
    return []
  }

  const [startDate, endDate] = dateRange.map((item) => new Date(`${item}T00:00:00`))
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return []

  const schedules =
    formJadwalLibur.value.mode === 'one'
      ? selectedSchedule.value
        ? [selectedSchedule.value]
        : []
      : formJadwalLibur.value.mode === 'time_range'
        ? jadwalTersedia.value.filter((schedule) =>
            isOverlappingTimeRange(
              schedule.start_time,
              schedule.end_time,
              formJadwalLibur.value.start_time,
              formJadwalLibur.value.end_time,
            ),
          )
        : jadwalTersedia.value

  const result: Array<jadwalTersedia & { tanggal: string }> = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    for (const schedule of schedules) {
      const scheduleDay = dayOfWeekMap[String(schedule.day_of_week).trim().toLowerCase()]
      if (scheduleDay === currentDate.getDay()) {
        result.push({
          ...schedule,
          tanggal: formatDate(currentDate),
        })
      }
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

function formatDate(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isOverlappingTimeRange(
  scheduleStart: string,
  scheduleEnd: string,
  targetStart: string,
  targetEnd: string,
) {
  if (!targetStart || !targetEnd) return false
  return toMinutes(scheduleStart) < toMinutes(targetEnd) && toMinutes(scheduleEnd) > toMinutes(targetStart)
}

function toMinutes(value: string) {
  const [hour = '0', minute = '0'] = value.split(':')
  return Number(hour) * 60 + Number(minute)
}
</script>
