<template>
  <div class="w-full h-full min-h-[8rem] bg-[#FFEBCD] shadow-lg rounded-lg p-5 flex flex-col justify-between">
    <div>
      <h2 class="text-md font-bold font-[jua] break-words">{{ title }}</h2>
      <p class="text-sm font-[jua] break-words">{{date}}</p>
    </div>
    <hr class="my-2 border-[#FAB12F] border-1" />
    <h1 class="text-3xl md:text-4xl font-[jua] font-bold break-words">{{ total }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    date?: number | string
    total: number
}>()
</script>
