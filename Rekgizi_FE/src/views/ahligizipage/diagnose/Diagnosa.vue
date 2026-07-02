<template>
  <AhliGiziLayout>
    <div class="flex justify-center gap-4" v-if="isCreate">
      <navigation
        :route="`/ahligizi/diagnosa/assessment/${id_rekam_pasien}?mode=create`"
        title="Asssement"
      />
      <navigation
        :route="`/ahligizi/diagnosa/diagnosa/create/${id_rekam_pasien}`"
        title="Diagnosa"
      />
      <navigation
        :route="`/ahligizi/diagnosa/intervention/create/${id_rekam_pasien}`"
        title="Intervensi"
      />
      <navigation :route="`/ahligizi/diagnosa/summary/create/${id_rekam_pasien}`" title="Summary" />
    </div>
    <div class="flex justify-center gap-4" v-if="isEdit">
      <navigation
        :route="`/ahligizi/diagnosa/assessment/${id_rekam_pasien}?mode=edit`"
        title="Asssement"
      />
      <navigation :route="`/ahligizi/diagnosa/diagnosa/edit/${id_rekam_pasien}`" title="Diagnosa" />
      <navigation
        :route="`/ahligizi/diagnosa/intervention/edit/${id_rekam_pasien}`"
        title="Intervensi"
      />
      <navigation :route="`/ahligizi/diagnosa/summary/edit/${id_rekam_pasien}`" title="Summary" />
    </div>

    <div class="w-full mx-4 h-auto bg-[#EAD3AF] my-4 rounded-lg overflow-hidden">
      <div class="bg-[#FAB12F] p-4 flex gap-3 text-2xl font-[jua] justify-between">
        <span class="cursor-pointer text-white"> Diagnosa </span>
    
      </div>
      <div v-for="(item, index) in diagnosaList" :key="index" class="p-4 flex gap-4 mx-2 mb-2">
        <div class="flex flex-col w-7/8">
          <select
            v-model="item.diagnosa_id"
            class="h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
          >
            <
            <option
              v-for="opt in diagnosaOptions"
              :key="opt.id"
              :value="opt.id"
              :disabled="isSelected(opt.id, index)"
            >
              {{ opt.kode }} - {{ opt.diagnosa }}
            </option>
          </select>
        </div>
        <div class="flex flex-col w-1/8 justify-end items-center">
          <button
            @click="toggleDiagnosa(index)"
            class="text-white p-2 rounded-lg w-10"
            :class="index === diagnosaList.length - 1 ? 'bg-[#FA812F]' : 'bg-red-500'"
          >
            <PlusIcon v-if="index === diagnosaList.length - 1" class="w-6 h-6" />
            <MinusIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
      <div class="flex justify-end mx-6 my-4">
        <button
          class="bg-[#FA812F] text-white px-4 py-2 rounded-lg font-[jua]"
          @click="saveDiagnosaPasien"
        >
          Simpan
        </button>
      </div>
    </div>
  </AhliGiziLayout>
</template>

<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import navigation from '@/components/costumeComponents/ahliGizi/navigation.vue'
import { computed, onMounted, ref } from 'vue'
import { PlusIcon, MinusIcon } from '@/icons'
import {
  getDiagnosa,
  getDiagnosaPasien,
  postDiagnosaPasien,
} from '@/service/ahliGizi/diagnosa/asuhan'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import router from '@/router'

const route = useRoute()
const id_rekam_pasien = Number(route.params.id)
const isEdit = computed(() => route.path.includes('edit'))
const isCreate = computed(() => route.path.includes('create'))

interface Diagnosa {
  id: number
  kode: string
  diagnosa: string
}

const diagnosaList = ref([
  {
    diagnosa_id: null as number | null,
  },
])

const isSelected = (id: number, currentIndex: number) => {
  return diagnosaList.value.some((item, index) => item.diagnosa_id === id && index !== currentIndex)
}

const diagnosaOptions = ref<Diagnosa[]>([])

const toggleDiagnosa = (index: number) => {
  if (index === diagnosaList.value.length - 1) {
    diagnosaList.value.push({
      diagnosa_id: null,
    })
  } else {
    diagnosaList.value.splice(index, 1)
  }
}

onMounted(async () => {
  await mapDiagnosa()
  await mapDiagnosaPasien()
})

async function mapDiagnosa() {
  const res = await getDiagnosa()

  diagnosaOptions.value = res.data.map((item: Diagnosa) => ({
    id: item.id,
    diagnosa: item.diagnosa,
    kode: item.kode,
  }))
}

async function mapDiagnosaPasien() {
  const res = await getDiagnosaPasien(id_rekam_pasien)

  diagnosaList.value = res.data
    .filter((item: any) => item.id_diagnosa !== null)
    .map((item: any) => ({
      diagnosa_id: item.id_diagnosa,
    }))
}

async function saveDiagnosaPasien() {
  const payload = {
    rekam_pasien_id: id_rekam_pasien,
    data: diagnosaList.value
      .filter((item) => item.diagnosa_id !== null)
      .map((item) => ({
        id_diagnosa: item.diagnosa_id,
      })),
  }

  try {
    await postDiagnosaPasien(id_rekam_pasien, payload)
    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disimpan',
      icon: 'success',
    })
    router.push(`/ahligizi/diagnosa/intervention/create/${id_rekam_pasien}`)
  } catch (error) {
    Swal.fire({
      title: 'ERROR',
      text: String(error),
      icon: 'warning',
    })
  }
}


</script>
