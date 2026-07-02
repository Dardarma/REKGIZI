<template>
  <div class="w-full">
    <!-- Search & Limit -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="border rounded-lg px-3 py-2 w-full md:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
      />

      <select
        v-model.number="limit"
        @change="currentPage = 1"
        class="border rounded-lg px-3 py-2 w-full md:w-32 bg-white focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="article in mappedArticles" :key="article.id" class="w-full">
        <articleCard
          :title="article.title"
          :text="article.text"
          :image="article.image"
          :to="article.to"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="mappedArticles.length === 0" class="text-center py-10 text-gray-500 font-[jua]">
      Artikel tidak ditemukan
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <!-- Prev -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 rounded-lg bg-[#FA812F] text-white font-[jua] hover:bg-[#E5700E] disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Sebelumnya
      </button>

      <!-- Page Numbers -->
      <button
        v-for="page in pages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-2 rounded-lg font-[jua] transition-colors',
          currentPage === page
            ? 'bg-[#FA812F] text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        ]"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 rounded-lg bg-[#FA812F] text-white font-[jua] hover:bg-[#E5700E] disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Selanjutnya
      </button>
    </div>

    <!-- Info -->
    <div v-if="totalPages > 1" class="text-center mt-4 text-sm font-[jua] text-gray-600">
      Halaman {{ currentPage }} dari {{ totalPages }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import articleCard from './articleCard.vue'
import { ImageUrl } from '@/utils/baseURL'

interface Article {
  id: number
  title?: string
  text?: string
  image?: string
  to?: string
  judul?: string
  konten?: string
  thumbnail_url?: string | null
}

interface Meta {
  current_page: number
  limit: number
  total: number
  total_pages: number
}

interface Props {
  articles: Article[]
  itemsPerPage?: number
  meta?: Meta
  getArticleLink?: (article:Article) => string
}

const props = defineProps<Props>()

// LOCAL & PARENT BINDABLE STATES (defineModel)
const search = defineModel<string>('search', { default: '' })
const currentPage = defineModel<number>('currentPage', { default: 1 })
const limit = defineModel<number>('limit', { default: 10 })

const emit = defineEmits(['change'])
// Set default limit to itemsPerPage if passed
if (props.itemsPerPage) {
  limit.value = props.itemsPerPage
}

// Reset to page 1 on search change
watch(search, () => {
  currentPage.value = 1
})

const getPreviewUrl = (url: string | null) => {
  if (!url) return ''

  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return ImageUrl(url)
}

// FILTER (Only for client-side search)
const filteredArticles = computed(() => {
  if (props.meta) {
    return props.articles
  }

  if (!search.value) return props.articles

  return props.articles.filter((article) => {
    const keyword = search.value.toLowerCase()
    const titleText = (article.judul || article.title || '').toLowerCase()
    const contentText = (article.konten || article.text || '').toLowerCase()

    return titleText.includes(keyword) || contentText.includes(keyword)
  })
})

// TOTAL PAGE
const totalPages = computed(() => {
  if (props.meta) {
    return props.meta.total_pages
  }
  return Math.ceil(filteredArticles.value.length / limit.value)
})

// PAGINATED
const paginatedArticles = computed(() => {
  if (props.meta) {
    return props.articles
  }

  const start = (currentPage.value - 1) * limit.value
  const end = start + limit.value

  return filteredArticles.value.slice(start, end)
})

// MAPPED ARTICLES FOR CARD DISPLAY
const mappedArticles = computed(() => {
  return paginatedArticles.value.map((article) => {
    const title = article.judul || article.title || ''

    // strip HTML tags
    let text = article.konten || article.text || ''
    if (article.konten) {
      text = article.konten.replace(/<[^>]*>/g, '')
    }

    const image = getPreviewUrl(article.thumbnail_url || article.image || null)
     const to = props.getArticleLink
      ? props.getArticleLink(article)
      : `/article/${article.id}`

    return {
      id: article.id,
      title,
      text,
      image,
      to,
    }
  })
})

// PAGE NUMBERS
const pages = computed(() => {
  const maxVisible = 5
  const total = totalPages.value

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))

  let end = start + maxVisible - 1

  if (end > total) {
    end = total
    start = total - maxVisible + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

watch(
  [search, currentPage, limit],
  () => {
    emit('change', {
      search: search.value,
      page: currentPage.value,
      limit: limit.value,
    })
  },
  {
    deep: true,
  },
)

const goToPage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}
</script>
