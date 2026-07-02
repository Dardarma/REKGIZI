<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import password_form from '@/components/costumeComponents/form input/password_form.vue'
import dateform from '@/components/costumeComponents/form input/dateform.vue'
import { registerService } from '@/service/dashboard/register'

const birthdate = ref('')
const router = useRouter()
const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

const form = ref({
  email: '',
  nama: '',
  jenis_kelamin: '',
  alamat: {
    desa: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    lengkap: '',
  },
  password: '',
  password_validation: '',
})

const isLoading = ref(false)

const handleRegister = async () => {
  if (form.value.password !== form.value.password_validation) {
    Swal.fire({
      icon: 'error',
      title: 'Register gagal',
      text: 'Password dan konfirmasi password tidak sama',
    })
    return
  }

  try {
    isLoading.value = true
    await registerService({
      email: form.value.email,
      nama: form.value.nama,
      jenis_kelamin: form.value.jenis_kelamin,
      tanggal_lahir: birthdate.value,
      alamat: {
        desa: form.value.alamat.desa,
        kecamatan: form.value.alamat.kecamatan,
        kota: form.value.alamat.kota,
        provinsi: form.value.alamat.provinsi,
        lengkap: form.value.alamat.lengkap,
      },
      password: form.value.password,
      password_validation: form.value.password_validation,
    })

    await Swal.fire({
      icon: 'success',
      title: 'Register berhasil',
      text: 'Silakan login menggunakan akun kamu',
      showConfirmButton: false,
      timer: 1500,
    })

    router.push('/login')
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Register gagal',
      text: error.response?.data?.message || 'Ada masalah saat register',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <body class="min-h-screen flex items-center justify-center bg-[#fef3e2] relative">
    <!-- Tombol Back -->
    <router-link
      to="/"
      class="absolute top-4 left-4 flex items-center gap-2 rounded-4xl bg-[#FA812F] px-4 py-4 text-white font-[jua] hover:bg-[#e86f1e]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </router-link>

    <div class="w-full max-w-xl rounded-2xl bg-[#ead3af] p-8 shadow-lg">
      <h1 class="mb-6 text-center text-4xl font-[jua] text-[#B72800]">Rekgizi</h1>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <input
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
          v-model="form.email"
          required
        />

        <input
          type="text"
          placeholder="Nama"
          class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
          v-model="form.nama"
          required
        />

        <div class="flex">
          <div class="flex-1 w-[30%] mr-3">
            <select
              class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              placeholder="Kelamin"
              v-model="form.jenis_kelamin"
              required
            >
              <option value="" disabled selected>Gender</option>
              <option value="pria">Pria</option>
              <option value="wanita">Wanita</option>
            </select>
          </div>
          <div class="flex-2">
            <dateform
              v-model="birthdate"
              :config="dateConfig"
              placeholder="Tanggal Lahir"
              required
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Desa"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            v-model="form.alamat.desa"
            required
          />

          <input
            type="text"
            placeholder="Kecamatan"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            v-model="form.alamat.kecamatan"
            required
          />

          <input
            type="text"
            placeholder="Kota/Kabupaten"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            v-model="form.alamat.kota"
            required
          />

          <input
            type="text"
            placeholder="Provinsi"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            v-model="form.alamat.provinsi"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Alamat lengkap"
            rows="6"
            class="w-full rounded-lg bg-white px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            v-model="form.alamat.lengkap"
            required
          ></textarea>
        </div>
        <password_form v-model="form.password" placeholder="Password" />
        <password_form v-model="form.password_validation" placeholder="Confirm Password" />

        <button
          type="submit"
          class="w-full rounded-xl bg-[#FA812F] py-2 text-white font-[jua] hover:bg-[#e86f1e]"
          :disabled="isLoading"
          :class="{ 'opacity-60 cursor-not-allowed': isLoading }"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <a href="/login" class="block text-center text-sm text-[#B72800] hover:underline"
          >Already have an account? Login</a
        >
      </form>
    </div>
  </body>
</template>
