<template>
      <div
        class="w-full max-w-full min-w-0 h-auto shadow-lg rounded-lg overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="bg-[#FAB12F] p-4 flex gap-3 text-2xl font-[jua]">
          <span class="cursor-pointer text-white"> {{ jenis_diet }} | {{ tanggal }} </span>
        </div>

        <!-- Body -->
        <div class="bg-[#EAD3AF] p-5 flex justify-center">
          <div class="flex-2 mx-2">
            <p class="font-[jua] text-xl mb-2">Tujuan Diet</p>
            <p class="font-[jua] text-md mb-4">
              {{ tujuan }}
            </p>
            <p class="font-[jua] text-xl mb-2">Prinsip Diet</p>
            <p class="font-[jua] text-md">
              {{ prinsip }}
            </p>
          </div>
          <div class="flex-1 mx-2 flex flex-col">
            <div>
              <p class="font-[jua] text-lg mb-2">Rencana Diet</p>
              <p class="font-[jua] text-md mb-1">Energi : {{ energi }}</p>
              <p class="font-[jua] text-md mb-1">Protein : {{ protein }}</p>
              <p class="font-[jua] text-md mb-1">Karbohidrat : {{ karbohidrat }}</p>
            </div>

            <button
              class="mt-auto w-[120px] bg-[#FAB12F] px-3 py-1 rounded-xl hover:bg-[#E67300] transition-colors duration-200 font-[jua] self-end"
              @click="emit('click')"
            >
              Details
            </button>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])
defineProps<{
    jenis_diet: string,
    tanggal: string,
    tujuan: string,
    prinsip: string,
    energi: number,
    protein: number,
    karbohidrat: number,
}>()
</script>