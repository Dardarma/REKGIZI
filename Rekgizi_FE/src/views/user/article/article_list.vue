<template>
  <UserLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Article</h1>
    <ArticlePagination
      :articles="articles"
      :meta="meta"
      :get-article-link="getArticleLink"
      v-model:search="search"
      v-model:currentPage="currentPage"
      v-model:limit="limit"
      @change="fetchArticles"
    />
  </UserLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserLayout from '@/components/layout/user/UserLayout.vue'
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

const getArticleLink = (article: any) => {
  return `/user/article/${article.id}`
}

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
