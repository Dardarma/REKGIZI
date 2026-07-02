<template>
  <AhliGiziLayout>
    <div class="flex flex-col gap-3 w-full">
      <div class="flex flex-col lg:flex-row gap-5 items-center justify-center w-full items-start">
        <JadwalTersedia />
        <JadwalLibur />
      </div>
    </div>
  </AhliGiziLayout>
</template>

<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import JadwalTersedia from '@/components/costumeComponents/ahliGizi/JanjiTemuCard/JadwalTersedia.vue'
import JadwalLibur from '@/components/costumeComponents/ahliGizi/JanjiTemuCard/JadwalLibur.vue'
</script>
