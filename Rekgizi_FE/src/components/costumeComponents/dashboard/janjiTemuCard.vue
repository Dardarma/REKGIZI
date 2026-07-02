<template>
  <div class="w-[320px] min-h-[6.25rem] bg-[#EAD3AF] shadow-lg rounded-lg p-5 flex justify-between overflow-hidden">
    <!-- Kiri -->
    <div class="flex-1 min-w-0">
      <p class="font-[jua] text-sm truncate">{{ date }}</p>
      <p class="font-[jua] text-sm">Location:</p>
      <p class="font-[jua] text-sm truncate">{{ location }}</p>
      <p class="font-[jua] text-sm mt-3 text-green-500" v-if="status === 'Confirmed'">{{ status }}</p>
      <p class="font-[jua] text-sm mt-3 text-red-500" v-else>{{ status }}</p>
    </div>

    <!-- Kanan -->
    <div class="flex flex-col items-end justify-between">
      <p class="font-[jua] text-lg">{{ time }}</p>
      <button
        class="mt-3 bg-[#FAB12F] px-3 py-1 rounded-xl hover:bg-[#E67300] transition-colors duration-200 font-[jua]"
        @click="emit('click')"
      >
        Details
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

defineProps<{
  date: string
  location: string
  status: string
  time: string
}>()
</script>
