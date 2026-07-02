<template>
  <component :is="activeLayout">
    <div class="mx-auto max-w-6xl">
      <form class="profile-card overflow-hidden rounded-lg bg-[#ECD4AB]" @submit.prevent="submitForm">
        <div class="flex items-center justify-between bg-[#FFB22C] px-4 py-4">
          <h1 class="font-[jua] text-2xl text-white">Edit Profile</h1>
          <span class="rounded-full bg-white/25 px-4 py-1 text-sm font-[jua] capitalize text-white">
            {{ roleLabel }}
          </span>
        </div>

        <div v-if="isLoading" class="py-10 text-center font-[jua] text-gray-700">
          Memuat profile...
        </div>

        <div v-else class="space-y-5 px-5 py-4">
          <div class="flex flex-col gap-4 lg:flex-row">
            <div class="flex flex-col lg:w-1/2">
              <label class="text-md mb-1 font-[jua]">Nama:</label>
              <input
                v-model="form.nama"
                type="text"
                class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan nama"
              />
            </div>

            <div class="flex flex-col lg:w-1/2">
              <label class="text-md mb-1 font-[jua]">Email:</label>
              <input
                v-model="form.email"
                type="email"
                class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan email"
              />
            </div>
          </div>

          <div class="flex flex-col gap-4 lg:flex-row">
            <div class="flex flex-col lg:w-1/3">
              <label class="text-md mb-1 font-[jua]">Gender:</label>
              <select
                v-model="form.jenis_kelamin"
                class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
              >
                <option value="" disabled>Pilih gender</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </select>
            </div>

            <div class="flex flex-col lg:w-1/3">
              <label class="text-md mb-1 font-[jua]">Tanggal Lahir:</label>
              <dateform v-model="form.tanggal_lahir" :config="dateConfig" placeholder="Tanggal lahir" />
            </div>

            <div class="flex flex-col lg:w-1/3">
              <label class="text-md mb-1 font-[jua]">Role:</label>
              <input
                :value="roleLabel"
                type="text"
                disabled
                class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] capitalize focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Desa:</label>
                <input v-model="form.alamat.desa" type="text" class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]" />
              </div>
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Kecamatan:</label>
                <input v-model="form.alamat.kecamatan" type="text" class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]" />
              </div>
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Kota:</label>
                <input v-model="form.alamat.kota" type="text" class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]" />
              </div>
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Provinsi:</label>
                <input v-model="form.alamat.provinsi" type="text" class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]" />
              </div>
            </div>

            <div class="mt-4">
              <label class="text-md mb-1 block font-[jua]">Alamat:</label>
              <textarea
                v-model="form.alamat.lengkap"
                rows="5"
                class="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 font-[jua] focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                placeholder="Masukkan alamat lengkap"
              ></textarea>
            </div>
          </div>

          <div class="border-t border-[#D4B27E] pt-4">
            <h2 class="mb-1 text-lg font-[jua]">Ubah Password</h2>
            <p class="mb-3 text-sm font-[jua] text-gray-700">
              Kosongkan jika tidak ingin mengganti password.
            </p>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Password Baru:</label>
                <password_form v-model="form.password" />
              </div>
              <div class="flex flex-col">
                <label class="text-md mb-1 font-[jua]">Konfirmasi Password:</label>
                <password_form v-model="form.password_validation" />
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-md bg-gray-200 px-4 py-2 font-[jua] text-gray-700 hover:bg-gray-300"
              @click="goBack"
            >
              Batal
            </button>
            <button
              type="submit"
              class="rounded-md bg-[#FA812F] px-4 py-2 font-[jua] text-white hover:bg-[#E67300] disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import UserLayout from '@/components/layout/user/UserLayout.vue'
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import AdminLayout from '@/components/layout/admin/AdminLayout.vue'
import dateform from '@/components/costumeComponents/form input/dateform.vue'
import password_form from '@/components/costumeComponents/form input/password_form.vue'
import { getProfile, updateProfile } from '@/service/profile'

const router = useRouter()
const isLoading = ref(true)
const isSubmitting = ref(false)
const role = ref(localStorage.getItem('role') || '')

const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

const form = ref({
  nama: '',
  email: '',
  jenis_kelamin: '',
  tanggal_lahir: '',
  password: '',
  password_validation: '',
  alamat: {
    desa: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    lengkap: '',
  },
})

const activeLayout = computed(() => {
  if (role.value === 'ahli_gizi') return AhliGiziLayout
  if (role.value === 'admin') return AdminLayout
  return UserLayout
})

const roleLabel = computed(() => role.value.replace(/_/g, ' ') || 'user')

onMounted(fetchProfile)

async function fetchProfile() {
  try {
    const res = await getProfile()
    const data = res.data
    role.value = data.role || role.value
    form.value = {
      nama: data.nama || '',
      email: data.email || '',
      jenis_kelamin: data.jenis_kelamin || '',
      tanggal_lahir: data.tanggal_lahir || '',
      password: '',
      password_validation: '',
      alamat: {
        desa: data.alamat?.desa || '',
        kecamatan: data.alamat?.kecamatan || '',
        kota: data.alamat?.kota || '',
        provinsi: data.alamat?.provinsi || '',
        lengkap: data.alamat?.lengkap || '',
      },
    }
  } catch (error: any) {
    Swal.fire({
      title: 'Gagal',
      text: error.response?.data?.detail || 'Gagal mengambil data profile',
      icon: 'warning',
    })
  } finally {
    isLoading.value = false
  }
}

async function submitForm() {
  const payload: any = {
    nama: form.value.nama,
    email: form.value.email,
    jenis_kelamin: form.value.jenis_kelamin,
    tanggal_lahir: form.value.tanggal_lahir,
    alamat: {
      desa: form.value.alamat.desa,
      kecamatan: form.value.alamat.kecamatan,
      kota: form.value.alamat.kota,
      provinsi: form.value.alamat.provinsi,
      lengkap: form.value.alamat.lengkap,
    },
  }

  if (form.value.password || form.value.password_validation) {
    payload.password = form.value.password
    payload.password_validation = form.value.password_validation
  }

  try {
    isSubmitting.value = true
    const res = await updateProfile(payload)
    localStorage.setItem('name', res.data.nama)
    window.dispatchEvent(new Event('profile-updated'))
    await Swal.fire({
      title: 'Berhasil',
      text: 'Profile berhasil diperbarui',
      icon: 'success',
      timer: 1500,
    })
    form.value.password = ''
    form.value.password_validation = ''
  } catch (error: any) {
    Swal.fire({
      title: 'Gagal',
      text: error.response?.data?.detail || error.response?.data?.message || 'Profile gagal diperbarui',
      icon: 'warning',
    })
  } finally {
    isSubmitting.value = false
  }
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.profile-card :deep(.flatpickr-input),
.profile-card :deep(input[type='password']),
.profile-card :deep(input[type='text']) {
  border-color: rgb(209 213 219);
  background-color: rgb(243 244 246);
  font-family: jua, sans-serif;
}
</style>
