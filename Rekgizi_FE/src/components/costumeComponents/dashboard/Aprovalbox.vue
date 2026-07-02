<template>
  <div
    class="container mx-auto mt-4 rounded-md bg-[#EAD3AF] p-4 
           grid grid-cols-[1fr_auto_auto] items-center gap-4"
  >
    <!-- Nama + Status -->
    <div class="min-w-0 font-[jua]">
      <h1 class="truncate text-base">
        {{ username }}
      </h1>

      <h3 class="text-sm text-green-600">
        {{ status }}
      </h3>
    </div>

    <!-- Tanggal -->
    <div class="min-w-[110px] text-center text-sm">
      <p>{{ formatTanggal(date) }}</p>
    </div>

    <!-- Button -->
    <div>
      <a
        :href="`/ahligizi/diagnosa/summary/edit/${id}`"
        class="inline-block whitespace-nowrap rounded-md bg-green-500 px-3 py-1 text-sm text-white"
      >
        View Details
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTanggal } from '@/utils/formatTanggal'

defineProps<{
  username: string
  status: string
  date: string
  id: number
}>()
</script>