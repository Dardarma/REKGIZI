<template>
  <!-- Dashboard  -->
  <div class="navbar-dashboard">
    <nav class="fixed top-0 z-50 w-full">
      <div class="mx-auto px-4" style="background-color: #ead3af">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-5">
            <a href="#home" class="text-xl font-[jua] text-white hover:text-gray-900"> Home </a>
            <a href="#about" class="text-xl font-[jua] text-white hover:text-gray-900"> About </a>
            <a href="#features" class="text-xl font-[jua] text-white hover:text-gray-900">
              Features
            </a>
            <a href="#article" class="text-xl font-[jua] text-white hover:text-gray-900">
              Article
            </a>
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
  <!-- Banner  -->
  <div id="home" class="banner-dashboard bg-[#ead3af] pt-20">
    <div class="container mx-auto px-4 pt-16 pb-10">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Konten Kiri (Teks) -->
        <div class="flex-1 text-center md:text-left">
          <img
            class="dark:hidden max-w-full h-auto object-contain"
            alt="Logo"
            width="500"
            height="400"
            src="@/assets/image/Logo.png"
          />
          <p class="font-[jua] text-2xl mt-5">
            Bantu tentukan rekomendasi diet pasien ginjal Secara Otomatis dengan sistem Kami
          </p>
        </div>
        <!-- Konten Kanan (Gambar/Ilustrasi) - Hidden di mobile, tampil di desktop -->
        <div class="hidden md:flex flex-1 justify-center">
            <img
            class="dark:hidden max-w-full h-auto object-contain"
            alt="Logo"
            width="500"
            height="400"
            src="@/assets/image/Ilustrasi.png"
          />
        </div>
      </div>
    </div>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path
      fill="#EAD3AF"
      fill-opacity="1"
      d="M0,224L34.3,224C68.6,224,137,224,206,197.3C274.3,171,343,117,411,90.7C480,64,549,64,617,80C685.7,96,754,128,823,160C891.4,192,960,224,1029,240C1097.1,256,1166,256,1234,234.7C1302.9,213,1371,171,1406,149.3L1440,128L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
    ></path>
  </svg>
  <!-- About us  -->
  <div id="about" class="about container mx-auto text-center pt-10">
    <h3 class="text-5xl font-[jua]">Tentang Kami</h3>
    <p class="text-3xl mt-5 font-[jua]">
      Selamat datang di Rekgizi AI, platform cerdas yang dirancang untuk membantu pasien penyakit
      ginjal mengatur pola makan dengan lebih mudah, aman, dan personal. Dengan teknologi kecerdasan
      buatan .
    </p>
  </div>
  <!-- Our  features-->
  <div id="features" class="our-features py-15 item-center text-center">
    <h3 class="text-5xl font-[jua]">Fitur Kami</h3>
    <feature title="Rekomendasi Diet Otomatis" icon="fas fa-utensils" />
    <feature title="Pemantauan Kesehatan" icon="fas fa-heartbeat" />
    <feature title="Penyuluhan Edukasi" icon="fas fa-book-open" />
  </div>
  <!-- Articles -->
  <div id="article" class="article container mx-auto text-center py-10">
    <h3 class="text-5xl font-[jua]">Artikel Kami</h3>
     <ArticlePagination
      :articles="articles"
      :meta="meta"
      v-model:search="search"
      v-model:currentPage="currentPage"
      v-model:limit="limit"
      :get-article-link="(articles) => `/article/${articles.id}`"
      @change="fetchArticles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import feature from '@/components/costumeComponents/dashboard/feature.vue'
import ArticlePagination from '@/components/costumeComponents/dashboard/articleCardPaginate.vue'
import { getArticle } from '@/service/user/article'
import Swal from 'sweetalert2'

interface Meta {
  current_page: number
  limit: number
  total: number
  total_pages: number
}

const meta = ref<Meta>()
const articles = ref<any[]>([])
const search = ref('')
const currentPage = ref(1)
const limit = ref(10)
const articleLink = ""

async function fetchArticles () {
  try {
    const article = await getArticle(search.value, currentPage.value, limit.value)
    console.log(article)
    articles.value = article.data ?? (article as any).data?.data ?? []
    meta.value = article.meta ?? (article as any).data?.meta
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal mengambil data article',
    })
  }
}

onMounted (() => {
  fetchArticles()
})
</script>
