<template>
  <AhliGiziLayout>
    <h1 class="text-3xl font-[jua] text-[#FA812F] mb-5">Article</h1>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded relative" role="alert">
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div class="mx-2 my-2">
      <TableSearch
        :headers="header"
        :rows="rows"
        :total="totalItems"
        :currentPage="currentPage"
        :limit="limitItems"
        :total_pages="totalPages"
        v-model:search="search"
      >
        <template #addNew>
          <RouterLink
            to="/ahligizi/artikel/create"
            class="bg-[#FA812F] text-white px-3 py-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200"
          >
            Add New
          </RouterLink>
        </template>
        <template #action="{ row }">
          <div class="flex items-center gap-2">
            <RouterLink
              :to="`/ahligizi/artikel/${row.id}`"
              class="bg-[#FA812F] text-white p-2 rounded-lg hover:bg-[#E67300] transition-colors duration-200 flex items-center justify-center"
            >
              <Pencil class="w-5 h-5" />
            </RouterLink>

            <button
              @click="handleDelete(row.id)"
              :disabled="isLoading"
              class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </template>
      </TableSearch>
      
      <!-- Overlay Loading (Optional but good UX) -->
      <div v-if="isLoading" class="mt-4 text-center text-gray-500">
        Loading...
      </div>
    </div>
  </AhliGiziLayout>
</template>

<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import { Pencil } from '@/icons/customeIcon'
import { onMounted, ref, watch } from 'vue'
import { TrashIcon } from '@/icons/index'
import TableSearch from '@/components/costumeComponents/common/tableSearch.vue'
import { useArticle } from '@/composables/useArticle'
import type { Article } from '@/types/article'

const { 
  isLoading, 
  error, 
  articles, 
  totalItems, 
  currentPage, 
  limitItems, 
  totalPages, 
  fetchArticles,
  removeArticle
} = useArticle()

const rows = ref<any[]>([])
const search = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

onMounted(() => {
  loadArticles()
})

watch(search, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadArticles()
  }, 1000)
})

watch([currentPage, limitItems], () => {
  loadArticles()
})

// Watch articles array from composable and map it to table rows
watch(articles, (newArticles) => {
  rows.value = newArticles.map((item: Article) => ({
    id: item.id,
    tanggal: item.tanggal,
    judul: item.judul,
    nama_pembuat: item.nama_pembuat,
    is_published: item.is_published ? 'Published' : 'Draft',
  }))
})

async function loadArticles() {
  await fetchArticles(search.value, currentPage.value, limitItems.value)
}

async function handleDelete(id: number) {
  if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
    try {
      await removeArticle(id)
      alert('Artikel berhasil dihapus')
      loadArticles() // refresh
    } catch (err) {
      console.error(err)
    }
  }
}

const header = [
  { label: 'Judul', key: 'judul' },
  { label: 'Author', key: 'nama_pembuat' },
  { label: 'Tanggal', key: 'tanggal' },
  { label: 'Status', key: 'is_published' },
]
</script>
