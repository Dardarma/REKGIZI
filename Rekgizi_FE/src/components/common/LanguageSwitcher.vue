<template>
  <div
    class="fixed bottom-4 right-4 z-[10000] flex items-center gap-1 rounded-full border border-[#FA812F] bg-white p-1 shadow-lg"
    role="group"
    aria-label="Language"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
      :class="locale === option.value ? 'bg-[#FA812F] text-white' : 'text-gray-600 hover:bg-orange-50'"
      :aria-pressed="locale === option.value"
      @click="setLocale(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { locale, setLocale, type Locale } from '@/i18n'

const options: Array<{ value: Locale; label: string }> = [
  { value: 'id', label: 'ID' },
  { value: 'en', label: 'EN' },
]
</script>

