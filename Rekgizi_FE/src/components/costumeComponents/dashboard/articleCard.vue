<template>
  <div
    @click="goToPage"
    class="group rounded-2xl bg-[#FAB12F] p-5 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
  >
    <!-- image -->
    <div class="flex justify-center overflow-hidden">
      <img
        :src="image"
        alt=""
        class="h-52 object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- content -->
    <div class="mt-4">
      <h4 class="text-2xl font-[jua] text-[#3B2F2F] line-clamp-1">
        {{ title }}
      </h4>

      <p class="text-md mt-3 font-[jua] text-[#5C4033] line-clamp-3 leading-relaxed">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
  text: string
  image: string
  to: string
}>()

const router = useRouter()

const goToPage = () => {
  router.push(props.to)
}
</script>