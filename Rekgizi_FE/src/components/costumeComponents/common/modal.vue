<template>
  <div
    v-if="dialogVisible"
    @click.self="closeModal"
    class="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-100"
  >
    <!-- modal box -->
    <div class="bg-white w-[850px] rounded-xl shadow-lg max-h-[90%] overflow-y-auto ">
      <!-- header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
        <button class="text-gray-500 hover:text-gray-700 text-xl" @click="closeModal">
          &times;
        </button>
      </div>

      <!-- body -->
      <div class="p-4">
        <form class="space-y-4">
          <slot name="body"> </slot>

          <div class="flex justify-end">
            <slot name="button"></slot>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  modalTitle: {
    type: String,
    default: 'Modal Title',
  },
  dialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])
function closeModal() {
  emit('close')
}
</script>
