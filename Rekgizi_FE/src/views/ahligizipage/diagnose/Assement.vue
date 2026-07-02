<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import navigation from '@/components/costumeComponents/ahliGizi/navigation.vue'
import Biodata from '@/components/costumeComponents/ahliGizi/AssementCard/Biodata.vue'
import Antropometri from '@/components/costumeComponents/ahliGizi/AssementCard/Antropometri.vue'
import Biokimia from '@/components/costumeComponents/ahliGizi/AssementCard/Biokimia.vue'
import FisikKlinis from '@/components/costumeComponents/ahliGizi/AssementCard/FisikKlinis.vue'
import Riwayat from '@/components/costumeComponents/ahliGizi/AssementCard/Riwayat.vue'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { getInputParameter, getRekamPasien, getRekamPasienParameter, getUserId } from '@/service/ahliGizi/diagnosa/asuhan'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

const assessmentMode = computed(() => String(route.query.mode || 'create'))
const isEdit = computed(() => assessmentMode.value === 'edit' || route.path.includes('edit'))
const isCreate = computed(() => assessmentMode.value === 'create' || route.path.includes('create'))

const initialTab = typeof route.query.tab === 'string' ? route.query.tab : 'Biodata'
const activeTab = ref(initialTab)
const id_rekam_pasien = Number(route.params.id)
const form = ref<Record<number, any>>({})

const rekamPasien = ref<RekamPasien>({
  id: 0,
  pasien_id: 0,
  tanggal_asesmen: new Date(),
  status: '',
  nama_pasien: '',
})

const parameters = ref<ParameterWithOpsi[]>([])

const pasien = ref<Pasien>({
  id: 0,
  nama: '',
  jenis_kelamin: '',
  alamat: { lengkap: '' },
  tanggal_lahir: '',
})

interface RekamPasien {
  id: number
  pasien_id: number
  tanggal_asesmen: Date
  status: string
  nama_pasien: string
}

interface Pasien {
  id: number
  nama: string
  jenis_kelamin: string
  alamat: {
    lengkap: string
  }
  tanggal_lahir: string
}

interface OpsiParameter {
  id: number
  parameter_id: number
  jawaban: string
}

interface ParameterWithOpsi {
  id: number
  nama: string
  kategori: 'antropometri' | 'biokimia' | 'riwayat' | 'fisik klinis'
  tipe_input: 'number' | 'select' | 'text' | 'boolean'
  satuan: string | null
  important: boolean
  opsi_parameter: OpsiParameter[]
  calculation?: ParameterCalculation | null
}

interface ParameterCalculationSource {
  source_parameter_id: number
  variable_name: string
}

interface ParameterCalculation {
  formula: string
  rounding?: number | null
  is_active: boolean
  sources: ParameterCalculationSource[]
}

onMounted(async () => {
  await mapRekamPasien()
  await fetchParameter()
  await mapRekamPasienParameter()
})

const tabs = [
  { id: 'Biodata', label: 'Biodata' },
  { id: 'Antropometri', label: 'Antropometri' },
  { id: 'Biokimia', label: 'Biokimia' },
  { id: 'Fisik Klinis', label: 'Fisik Klinis' },
  { id: 'Riwayat', label: 'Riwayat' },
]

const getTabClass = (tabId: string) => ({
  'text-white': activeTab.value === tabId,
  'text-black': activeTab.value !== tabId,
  'cursor-pointer hover:text-white': true,
})

async function mapRekamPasien() {
  const res = await getRekamPasien(id_rekam_pasien)

  rekamPasien.value = res.data
  mapPasien()
}

async function mapPasien() {
  const res = await getUserId(rekamPasien.value?.pasien_id)

  pasien.value = res.data
}

async function fetchParameter() {
  const res = await getInputParameter()

  parameters.value = res.data
}

async function mapRekamPasienParameter() {
  const res = await getRekamPasienParameter(id_rekam_pasien)

  const result: Record<number, any> = {}

  res.data.forEach((item: any) => {
    result[item.parameter_id] = {
      jawaban: item.jawaban,
      opsi_parameter_id: item.opsi_parameter_id
    }
  })

  form.value = result
}

function calculatePreview(formula: string, variables: Record<string, number>) {
  const variableNames = Object.keys(variables)
  const validFormula = /^[0-9a-zA-Z_+\-*/().\s]+$/.test(formula)

  if (!validFormula) return null

  try {
    const calculate = new Function(...variableNames, `return ${formula}`)
    const result = calculate(...variableNames.map((name) => variables[name]))

    return Number.isFinite(result) ? Number(result) : null
  } catch {
    return null
  }
}

watchEffect(() => {
  const nextForm = { ...form.value }
  let changed = false

  parameters.value.forEach((parameter) => {
    const calculation = parameter.calculation

    if (!calculation?.is_active) return

    const variables: Record<string, number> = {}

    for (const source of calculation.sources || []) {
      const rawValue = nextForm[source.source_parameter_id]?.jawaban

      if (rawValue === undefined || rawValue === null || rawValue === '') return

      const value = Number(rawValue)
      if (!Number.isFinite(value)) return

      variables[source.variable_name] = value
    }

    if (Object.keys(variables).length !== calculation.sources.length) return

    const result = calculatePreview(calculation.formula, variables)
    if (result === null) return

    const rounded =
      calculation.rounding === null || calculation.rounding === undefined
        ? result
        : Number(result.toFixed(calculation.rounding))

    const answer = String(rounded)
    if (nextForm[parameter.id]?.jawaban !== answer) {
      nextForm[parameter.id] = {
        opsi_parameter_id: null,
        jawaban: answer,
      }
      changed = true
    }
  })

  if (changed) {
    form.value = nextForm
  }
})

function pushRouter(){
  console.log ('ini jalan gak ya?')
  if(isCreate.value){
    console.log('current:', route.fullPath)
    console.log('id rekam pasien:', id_rekam_pasien)
    router.push(`/ahligizi/diagnosa/diagnosa/create/${id_rekam_pasien}`)
  }else if(isEdit.value){
    router.push(`/ahligizi/diagnosa/diagnosa/edit/${id_rekam_pasien}`)
  }
}

const antropometri = computed(() => parameters.value.filter((p) => p.kategori === 'antropometri'))

const biokimia = computed(() => parameters.value.filter((p) => p.kategori === 'biokimia'))

const riwayat = computed(() => parameters.value.filter((p) => p.kategori === 'riwayat'))

const fisikKlinis = computed(() => parameters.value.filter((p) => p.kategori === 'fisik klinis'))

function sortByImportant(data: ParameterWithOpsi[]) {
  return [...data].sort((a, b) => Number(b.important) - Number(a.important))
}

const antropometriSorted = computed(() => sortByImportant(antropometri.value))

const biokimiaSorted = computed(() => sortByImportant(biokimia.value))

const riwayatSorted = computed(() => sortByImportant(riwayat.value))

const fisikKlinisSorted = computed(() => sortByImportant(fisikKlinis.value))
</script>

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
      <navigation
        :route="`/ahligizi/diagnosa/diagnosa/edit/${id_rekam_pasien}`"
        title="Diagnosa"
      />
      <navigation
        :route="`/ahligizi/diagnosa/intervention/edit/${id_rekam_pasien}`"
        title="Intervensi"
      />
      <navigation :route="`/ahligizi/diagnosa/summary/edit/${id_rekam_pasien}`" title="Summary" />
    </div>

    <div class="w-full mx-4 h-auto bg-[#EAD3AF] my-4 rounded-lg overflow-hidden">
      <div class="bg-[#FAB12F] p-4 flex items-center gap-3 text-2xl font-[jua]">
        <template v-for="(tab, index) in tabs" :key="tab.id">
          <span class="cursor-pointer" :class="getTabClass(tab.id)" @click="activeTab = tab.id">
            {{ tab.label }}
          </span>
          <span v-if="index < tabs.length - 1">></span>
        </template>
      </div>
      <div class="p-4">
        <div v-if="activeTab === 'Biodata'">
          <Biodata :pasien="pasien" @success="activeTab = 'Antropometri'"/>
        </div>
        <div v-else-if="activeTab === 'Antropometri'">
          <Antropometri :parameters="antropometriSorted" :rekam_pasien_id="id_rekam_pasien" v-model="form" @success="activeTab = 'Biokimia'"/>
        </div>
        <div v-else-if="activeTab === 'Biokimia'">
          <Biokimia :parameters="biokimiaSorted" :rekam_pasien_id="id_rekam_pasien" v-model="form" @success="activeTab = 'Fisik Klinis'"/>
        </div>
        <div v-else-if="activeTab === 'Fisik Klinis'">
          <FisikKlinis :parameters="fisikKlinisSorted" :rekam_pasien_id="id_rekam_pasien" v-model="form"@success="activeTab = 'Riwayat'"/>
        </div>
        <div v-else-if="activeTab === 'Riwayat'">
          <Riwayat :parameters="riwayatSorted" :rekam_pasien_id="id_rekam_pasien" v-model="form" @success="pushRouter"/>
        </div>
      </div>
    </div>
  </AhliGiziLayout>
</template>
