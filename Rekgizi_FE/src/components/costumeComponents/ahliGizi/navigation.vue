<template>
  <div class="flex">
    <router-link :to="route" class="block">
      <div
        class="w-48 min-h-[5rem] shadow-lg rounded-lg p-4 flex items-center justify-center"
        :class="isActive ? 'bg-[#F59E0B]' : 'bg-[#FAB12F]'"
      >
        <h2
          class="text-xl font-bold font-[jua] text-center break-words"
          :class="isActive ? 'text-white' : 'text-black'"
        >
          {{ title }}
        </h2>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router"
import { computed } from "vue"

const props = defineProps({
  route: String,
  title: String
})

const currentRoute = useRoute()

const isActive = computed(() => {
  return currentRoute.path === props.route
})
</script>