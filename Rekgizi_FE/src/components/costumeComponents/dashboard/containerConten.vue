<template>
  <div class="w-full h-full bg-[#FFEBCD] shadow-lg rounded-lg p-5 flex flex-col">
    
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-md font-bold font-[jua]">
        {{ title }}
      </h2>
      <slot name="Button"></slot>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <slot></slot>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
