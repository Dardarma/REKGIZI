<template>
  <div class="w-full font-[jua]">
    <div class="mb-3">
      <div class="justify-content-between flex items-center">
        <div class="w-1/2">
          <input
            :value="search"
            @input="onInputSearch($event as InputEvent)"
            type="text"
            placeholder="Search..."
            class="border rounded-lg px-3 py-1 w-64 bg-white focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
          />
          <select
            v-model.number="limit"
            @change="currentPage = 1"
            class="m-2 border rounded-lg px-3 py-1 w-32 bg-white focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div class="w-1/2 text-right">
          <slot name="addNew"></slot>
        </div>
      </div>
    </div>

    <table class="w-full rounded-lg overflow-hidden table-auto">
      <!-- HEADER -->
      <thead>
        <tr class="bg-[#FAB12F] text-center">
          <th>Nomor</th>
          <th
            v-for="header in headers"
            :key="header.key"
            class="px-4 py-2 cursor-pointer"
            @click="sort(header.key)"
          >
            {{ header.label }}
          </th>

          <th v-if="$slots.action" class="px-4 py-2">Action</th>
        </tr>
      </thead>

      <!-- BODY -->
      <tbody>
        <tr v-if="rows.length === 0">
          <td
            :colspan="headers.length + ($slots.action ? 1 : 0) + 1"
            class="py-4 bg-[#FFC899] text-center"
          >
            Data tidak ditemukan
          </td>
        </tr>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="bg-[#FFEBCD] hover:bg-[#FFC899] transition-colors duration-200 text-center"
        >
          <td>{{ index + 1 }}</td>
          <td v-for="header in headers" :key="header.key" class="px-4 py-2">
            {{ row[header.key] }}
          </td>

          <!-- ACTION SLOT -->
          <td v-if="$slots.action" class="px-4 py-2">
            <slot name="action" :row="row" :index="index"></slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between items-center mt-4">
      <div>Showing {{ rows.length }} of {{ total }} entries</div>

      <div class="flex items-center gap-2">
        <!-- Previous -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg bg-[#FA812F] text-white disabled:opacity-50"
        >
          Prev
        </button>

        <!-- Page Numbers -->
        <button
          v-for="page in pages"
          :key="page"
          @click="goToPage(page)"
          class="px-3 py-1 rounded-lg"
          :class="
            page === currentPage ? 'bg-[#FA812F] text-white' : 'bg-[#FFEBCD] hover:bg-[#FFC899]'
          "
        >
          {{ page }}
        </button>

        <!-- Next -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg bg-[#FA812F] text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Header {
  label: string
  key: string
}

interface Props {
  headers: Header[]
  rows: any[]
  total: number
  currentPage: number
  limit: number
  total_pages: number
  search: string
}

const props = defineProps<Props>()

const emit = defineEmits(['update:search', 'change'])

//SEARCH
const search = computed(() => props.search)

// SORT
const sortKey = ref('')
const sortAsc = ref(true)

// limit (local state untuk kontrol UI)
const currentPage = ref(props.currentPage || 1)
const limit = ref(props.limit || 10)

const onInputSearch = (event: InputEvent) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:search', value)
}

watch([currentPage, limit, sortKey, sortAsc], () => {
  currentPage.value = 1
}, {
  immediate: false
})


const sort = (key: string) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}


const goToPage = (page: number) => {
  currentPage.value = page
}

const totalPages = computed(() => props.total_pages || 1)

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

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>
