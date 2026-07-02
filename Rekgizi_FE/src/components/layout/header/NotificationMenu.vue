<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:bg-gray-100 hover:text-gray-700 h-11 w-11"
      @click="toggleDropdown"
      title="Notifikasi janji temu"
    >
      <span
        v-if="unreadCount > 0"
        class="absolute -right-1 -top-1 z-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FA812F] px-1 text-[11px] font-semibold text-white"
      >
        {{ unreadCount }}
      </span>
      <BellIcon class="h-5 w-5" />
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute -right-[120px] mt-4 flex max-h-[480px] w-[350px] flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-lg sm:w-[380px] lg:right-0"
    >
      <div class="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
        <h5 class="text-lg font-semibold text-gray-800">Notifikasi Janji Temu</h5>
        <button class="text-sm text-gray-500 hover:text-gray-800" @click="clearNotifications">
          Bersihkan
        </button>
      </div>

      <div v-if="notifications.length === 0" class="py-8 text-center text-sm text-gray-500">
        Belum ada notifikasi janji temu.
      </div>

      <ul v-else class="flex flex-col overflow-y-auto">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="cursor-pointer rounded-lg border-b border-gray-100 p-3 hover:bg-gray-50"
          @click="openJadwalModal(notification)"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-medium text-gray-800">{{ notification.title }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ notification.body }}</p>
              <p class="mt-2 text-xs text-gray-400">{{ formatNotificationTime(notification.receivedAt) }}</p>
            </div>
            <span
              v-if="!notification.read"
              class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FA812F]"
            ></span>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="modalOpen"
      class="fixed inset-0 z-99999 flex items-center justify-center bg-black/40 px-4"
    >
      <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-800">Detail Janji Temu</h3>
          <button class="text-gray-500 hover:text-gray-800" @click="closeModal">x</button>
        </div>

        <div v-if="loadingDetail" class="py-8 text-center text-gray-500">
          Memuat data janji temu...
        </div>

        <div v-else class="space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-600">Nama Pasien</label>
              <input class="w-full rounded-lg border px-3 py-2 bg-gray-50" :value="form.nama_pasien" disabled />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-600">Tanggal</label>
              <input class="w-full rounded-lg border px-3 py-2 bg-gray-50" :value="form.tanggal_konseling" disabled />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-600">Hari</label>
              <input class="w-full rounded-lg border px-3 py-2 bg-gray-50" :value="form.day_of_week" disabled />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-600">Jam</label>
              <input class="w-full rounded-lg border px-3 py-2 bg-gray-50" :value="form.jam" disabled />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-600">Status</label>
            <select
              class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              v-model="form.status"
            >
              <option value="pending">Pending</option>
              <option value="approved">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-600">Catatan</label>
            <textarea
              class="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              rows="3"
              v-model="form.catatan"
              placeholder="Tambahkan catatan"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300" @click="closeModal">
              Batal
            </button>
            <button
              class="rounded-lg bg-[#FA812F] px-4 py-2 text-white hover:bg-[#e86f1e] disabled:opacity-60"
              :disabled="saving"
              @click="submitStatus"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { BellIcon } from '@/icons'
import { getJanjiTemuById, updateStatusJanjiTemu } from '@/service/ahliGizi/janjitemu/janji_temu'

type JadwalNotification = {
  id: string
  jadwal_id: number
  title: string
  body: string
  receivedAt: string
  read: boolean
}

type JadwalForm = {
  id: number | null
  nama_pasien: string
  tanggal_konseling: string
  day_of_week: string
  jam: string
  status: string
  catatan: string
}

const STORAGE_KEY = 'jadwal_notifications'

const dropdownOpen = ref(false)
const modalOpen = ref(false)
const loadingDetail = ref(false)
const saving = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const notifications = ref<JadwalNotification[]>([])
const form = ref<JadwalForm>({
  id: null,
  nama_pasien: '',
  tanggal_konseling: '',
  day_of_week: '',
  jam: '',
  status: 'pending',
  catatan: '',
})

const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length)

function loadNotifications() {
  const rawNotifications = localStorage.getItem(STORAGE_KEY)
  notifications.value = rawNotifications ? JSON.parse(rawNotifications) : []
}

function saveNotifications() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.value))
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function closeDropdown() {
  dropdownOpen.value = false
}

function closeModal() {
  modalOpen.value = false
}

function clearNotifications() {
  notifications.value = []
  saveNotifications()
}

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function addNotification(event: Event) {
  const detail = (event as CustomEvent).detail
  const jadwalId = Number(detail?.data?.jadwal_id)

  if (!jadwalId || detail?.data?.type !== 'jadwal_konseling_created') return

  notifications.value.unshift({
    id: `${jadwalId}-${Date.now()}`,
    jadwal_id: jadwalId,
    title: detail.title || 'Janji temu baru',
    body: detail.body || 'Ada pengajuan janji temu baru.',
    receivedAt: detail.receivedAt || new Date().toISOString(),
    read: false,
  })
  notifications.value = notifications.value.slice(0, 20)
  saveNotifications()
}

async function openJadwalModal(notification: JadwalNotification) {
  notification.read = true
  saveNotifications()
  closeDropdown()
  modalOpen.value = true
  loadingDetail.value = true

  try {
    const response = await getJanjiTemuById(notification.jadwal_id)
    const jadwal = response.data

    form.value = {
      id: jadwal.id,
      nama_pasien: jadwal.nama_pasien,
      tanggal_konseling: jadwal.tanggal_konseling,
      day_of_week: jadwal.day_of_week,
      jam: `${jadwal.start_time} - ${jadwal.end_time}`,
      status: jadwal.status,
      catatan: jadwal.catatan || '',
    }
  } catch (error) {
    closeModal()
    Swal.fire({
      title: 'Gagal',
      text: 'Gagal mengambil detail janji temu',
      icon: 'error',
    })
  } finally {
    loadingDetail.value = false
  }
}

async function submitStatus() {
  if (!form.value.id) return

  saving.value = true
  try {
    await updateStatusJanjiTemu(form.value.id, {
      status: form.value.status,
      catatan: form.value.catatan,
    })

    Swal.fire({
      title: 'Berhasil',
      text: 'Status janji temu berhasil diperbarui',
      icon: 'success',
    })
    closeModal()
  } catch (error) {
    Swal.fire({
      title: 'Gagal',
      text: 'Status janji temu gagal diperbarui',
      icon: 'error',
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadNotifications()
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('fcm-notification', addNotification)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('fcm-notification', addNotification)
})
</script>
