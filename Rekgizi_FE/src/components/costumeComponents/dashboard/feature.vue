<template>
  <div class="container mx-auto mt-10 flex w-1/2 rounded-4xl bg-[#FAB12F] p-4 md:w-1/3">
    <div class="w-1/4 px-3 flex items-center justify-center">
      <i :class="icon" class="text-3xl text-white"></i>
    </div>
    <div class="w-3/4 px-3 font-[Jua] text-xl text-white">
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
}>()
</script>