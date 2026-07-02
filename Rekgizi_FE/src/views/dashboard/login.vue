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

    <div class="w-full max-w-sm rounded-2xl bg-[#ead3af] p-8 shadow-lg">
      <h1 class="mb-6 text-center text-4xl font-[jua] text-[#B72800]">Rekgizi</h1>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <input
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
          v-model="email"
        />

        <password_form placeholder="Password" v-model="password" />

        <div class="flex">
          <input type="checkbox" id="remember" class="mr-2" />
          <label for="remember" class="text-sm text-gray-600">Remember me</label>
          <a href="#" class="ml-auto text-sm hover:underline">Forgot password?</a>
        </div>

        <button
          class="w-full rounded-xl bg-[#FA812F] py-2 text-white font-[jua] hover:bg-[#e86f1e]"
        >
          Login
        </button>
        <a href="/register" class="block text-center text-sm text-[#B72800] hover:underline"
          >Don't have an account? Register</a
        >
      </form>
    </div>
  </body>
</template>

<script setup lang="ts">
import password_form from '@/components/costumeComponents/form input/password_form.vue'
import { ref } from "vue"
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import { setCookies, setInformation } from '@/utils/storage'
import { loginService } from '@/service/dashboard/login'
import { redirectPage } from '@/utils/redirectPage'
import { requestFcmToken } from '@/utils/firebase'
import { saveNotificationToken } from '@/service/notification'


const email = ref("")
const password = ref("")

const router = useRouter()


const handleLogin = async () => {
  try {
    const data = await loginService(email.value, password.value)

    setCookies(data.access_token)
    setInformation(data.user)

    try {
      if (data.user.role === 'ahli_gizi') {
        const token = await requestFcmToken()
        if (token) {
          await saveNotificationToken(token)
        }
      }
    } catch (notificationError) {
      console.error('Gagal mengaktifkan notifikasi:', notificationError)
    }

    await Swal.fire({
      icon: "success",
      title: "Login berhasil",
      showConfirmButton: false,
      timer: 1500
    })

    redirectPage(router, data.user.role)

  } catch (error: any) {

    Swal.fire({
      icon: "error",
      title: "Login gagal",
      text: error.response?.data?.message || "Ada masalah saat login"
    })

    console.error(error)
  }
}
</script>
