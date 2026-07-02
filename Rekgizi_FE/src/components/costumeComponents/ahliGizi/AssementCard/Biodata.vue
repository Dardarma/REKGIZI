<template>
  <div class="flex gap-4 mx-2 mb-2">
    <!-- Name -->
    <div class="flex flex-col w-1/2">
      <label class="text-md font-[jua] mb-1">Name:</label>
      <input
        type="text"
        v-model="pasien.nama"
        disabled
        class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:outline-none font-[jua]"
      />
    </div>

    <!-- Gender -->
    <div class="flex flex-col w-1/4">
      <label class="text-md font-[jua] mb-1">Gender:</label>
      <input
        type="text"
        v-model="pasien.jenis_kelamin"
        disabled
        class="h-11 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:outline-none font-[jua]"
      />
    </div>

    <!-- Birth Date -->
    <div class="flex flex-col w-1/4">
      <label class="text-md font-[jua] mb-1">Tanggal Lahir:</label>
      <dateform
        v-model="pasien.tanggal_lahir"
        :config="dateConfig"
        placeholder="Tanggal Lahir"
        :disabled="true"
        class="bg-gray-100"
      />
    </div>
  </div>

  <!-- Address -->
  <div class="flex gap-4 mx-2 mb-2">
    <div class="flex flex-col w-full">
      <label class="text-md font-[jua] mb-1">Alamat:</label>
      <textarea
        v-model="pasien.alamat.lengkap"
        disabled
        class="w-full rounded-xl border bg-gray-100 px-4 py-2 focus:outline-none"
        rows="5"
      />
    </div>
  </div>

  <div class="grid justify-items-stretch mx-5">
    <button
      type="button"
      class="bg-[#FA812F] text-white px-4 py-2 rounded-md hover:bg-[#E67300] justify-self-end"
      @click="$emit('success')"
    >
      next
    </button>
  </div>
</template>
<script setup lang="ts">
import dateform from '@/components/costumeComponents/form input/dateform.vue'

const dateConfig = {
  minDate: '1800-01-01',
  maxDate: 'today',
}

interface Pasien {
  id: number
  nama: string
  jenis_kelamin: string
  alamat: { lengkap: string }
  tanggal_lahir: string
}

const props = defineProps<{
  pasien: Pasien
}>()


</script>
