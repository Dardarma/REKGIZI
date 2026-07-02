<template>
  <!-- Dashboard  -->
  <div class="navbar-dashboard">
    <nav class="fixed top-0 z-50 w-full">
      <div class="mx-auto px-4" style="background-color: #ead3af">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-5">
            <router-link to="/" class="text-xl font-[jua] text-white hover:text-gray-900"> Home </router-link>
          </div>

          <div class="flex items-center gap-5">
            <router-link
              to="/register"
              class="rounded-4xl bg-[#FA812F] px-3 py-2 text-xl font-[jua] text-white hover:bg-white hover:text-[#FA812F]"
            >
              Sign up
            </router-link>
            <router-link
              to="/login"
              class="rounded-4xl bg-[#FA812F] px-3 py-2 text-xl font-[jua] text-white hover:bg-white hover:text-[#FA812F]"
            >
              login
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
  <div class="relative max-w-4xl mx-auto px-4 py-6 mt-15">
    <router-link
      to="/"
      class="inline-flex items-center gap-2 mb-6 rounded-full bg-[#FA812F] px-4 py-3 text-white font-[jua] hover:bg-[#e86f1e]"
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

      Back
    </router-link>

    <!-- Thumbnail -->
    <img
      v-if="article.thumbnail"
      :src="ImageUrl(article.thumbnail)"
      alt="thumbnail"
      class="w-full h-[400px] object-cover rounded-xl mb-6"
    />

    <!-- Title -->
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-4">
      {{ article.title }}
    </h1>
    <span class="text-gray-500 text-sm mb-4"
      >Diterbitkan pada {{ formatTanggal(article.createdAt) }} oleh {{ article.author }}</span
    >

    <!-- Content -->
    <div class="prose max-w-none" v-html="article.content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '@/service/user/article'
import Swal from 'sweetalert2'
import { formatTanggal } from '@/utils/formatTanggal'
import { ImageUrl } from '@/utils/baseURL'
import { resolveArticleContentImages } from '@/utils/articleContent'

const route = useRoute()
const articleId = Number(route.params.id)

const article = ref({
  title: '',
  content: '',
  thumbnail: '',
  author: '',
  createdAt: '',
})

async function fetchArticle() {
  try {
    const res = await getArticleById(articleId)
    article.value.title = res.data.judul
    article.value.content = resolveArticleContentImages(res.data.konten)
    article.value.thumbnail = res.data.thumbnail_url
    article.value.author = res.data.nama_pembuat
    article.value.createdAt = res.data.tanggal
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal mengambil data artikel',
      text: 'Silahkan coba lagi',
    })
  }
}

onMounted(async () => {
  fetchArticle()
})
</script>
