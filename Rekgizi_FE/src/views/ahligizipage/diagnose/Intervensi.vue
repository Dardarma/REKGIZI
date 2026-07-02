<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import navigation from '@/components/costumeComponents/ahliGizi/navigation.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { getIntervensi, prediksiIntervensi, saveIntervensi } from '@/service/ahliGizi/diagnosa/asuhan_intervensi'
import Swal from 'sweetalert2'
import { getRekamPasien } from '@/service/ahliGizi/diagnosa/asuhan'
import { setujuiIntervensi } from '@/service/ahliGizi/diagnosa/asuhan_intervensi'
import router from '@/router'


const route = useRoute()
const id_rekam_pasien = Number(route.params.id)

const isEdit = computed(() => route.path.includes('edit'))
const isCreate = computed(() => route.path.includes('create'))

onMounted(async () => {
  await mapIntervensiOptions()
  await fetchRekamPasien()
})

const intervensiOptions = ref<Intervensi[]>([])
const selectedIntervensiId = ref<number | null>(null)

const prinsip = ref<string>('')
const energi = ref<number | null>(null)
const protein = ref<number | null>(null)
const karbohidrat = ref<number | null>(null)
const edukasi = ref<string>('')
const tujuan = ref<string>('')

const selectedIntervensi = computed(() => {
  return (
    intervensiOptions.value.find((item) => item.id === Number(selectedIntervensiId.value)) || null
  )
})

const isInitialized = ref(false)

watch(selectedIntervensi, (newVal) => {
  if (!isInitialized.value) return

  if (newVal) {
    prinsip.value = newVal.prinsip || ''
    energi.value = newVal.energi || null
    protein.value = newVal.protein || null
    karbohidrat.value = newVal.karbohidrat || null
    edukasi.value = newVal.edukasi || ''
    tujuan.value = newVal.tujuan || ''
  }
})

interface Intervensi {
  id: number
  jenis_diet: string
  tujuan: string
  prinsip: string
  edukasi: string
  protein: number
  karbohidrat: number
  energi: number
}

async function mapIntervensiOptions() {
  const intervensi = await getIntervensi()
  intervensiOptions.value =
    intervensi.data.map((item: Intervensi) => ({
      id: item.id,
      jenis_diet: item.jenis_diet,
      tujuan: item.tujuan,
      prinsip: item.prinsip,
      edukasi: item.edukasi,
      protein: item.protein,
      karbohidrat: item.karbohidrat,
      energi: item.energi,
    })) ?? []
}

async function submitForm() {
  const payload = getIntervensiPayload()

  if (!payload) {
    await Swal.fire({
      title: 'Error',
      text: 'Pilih intervensi dulu',
      icon: 'error',
    })
    return
  }

  await saveIntervensi(id_rekam_pasien, payload)

  await Swal.fire({
    title: 'Berhasil',
    text: 'Data berhasil disimpan',
    icon: 'success',
  })
}

function getIntervensiPayload() {
  if (!selectedIntervensiId.value) return null

  return {
    intervensi_id: selectedIntervensiId.value,
    jenis_diet: selectedIntervensi.value?.jenis_diet || '',
    tujuan: tujuan.value,
    prinsip: prinsip.value,
    edukasi: edukasi.value,
    energi: energi.value ?? 0,
    protein: protein.value ?? 0,
    karbohidrat: karbohidrat.value ?? 0,
  }
}

async function setujui() {
  try {
    const payload = getIntervensiPayload()

    if (!payload) {
      await Swal.fire({
        title: 'Error',
        text: 'Pilih intervensi dulu',
        icon: 'error',
      })
      return
    }
    await Swal.fire({
      title:"Setujui Intervensi",
      text:"yakin ingin menyetujui intervensi ini?",
      icon:"question",
      showCancelButton:true,
      confirmButtonText:"Ya",
      cancelButtonText:"Tidak"
    })

    await setujuiIntervensi(id_rekam_pasien, payload)

    await Swal.fire({
      title: 'Berhasil',
      text: 'Data berhasil disetujui',
      icon: 'success',
    })

    await router.push(`/ahligizi/diagnosa/summary/edit/${id_rekam_pasien}`)

  } catch (error: any) {

    await Swal.fire({
      title: 'Error',
      text: error?.response?.data?.message || 'Data gagal disetujui',
      icon: 'error',
    })
  }
}

async function fetchRekamPasien() {
  const res = await getRekamPasien(id_rekam_pasien)

  selectedIntervensiId.value = res.data.intervensi_id

  prinsip.value = res.data.prinsip_intervensi
  energi.value = res.data.energi
  protein.value = res.data.protein
  karbohidrat.value = res.data.karbohidrat
  edukasi.value = res.data.edukasi_intervensi
  tujuan.value = res.data.tujuan_intervensi

  isInitialized.value = true
}

async function prediksiDiagnosa(id:number){
  try {
    await prediksiIntervensi(id)
    await Swal.fire({
      title: 'Berhasil',
      text: 'Prediksi intervensi berhasil dilakukan',
      icon: 'success',
    })
   fetchRekamPasien()
  } catch (error: any) {
    let errorHtml = String(error)
    
    const responseData = error.response?.data
    if (responseData?.detail?.missing_parameters) {
      errorHtml = responseData.detail.missing_parameters.map((p: any) => `${p.parameter_nama} belum diisi`).join('<br>')
    } else if (responseData?.message?.missing_parameters) {
      errorHtml = responseData.message.missing_parameters.map((p: any) => `${p.parameter_nama} belum diisi`).join('<br>')
    } else if (responseData?.message?.message) {
      errorHtml = responseData.message.message
    } else if (responseData?.detail) {
      errorHtml = typeof responseData.detail === 'string' ? responseData.detail : JSON.stringify(responseData.detail)
    }

    Swal.fire({
      title: 'Data Belum Lengkap',
      html: errorHtml,
      icon: 'warning',
    })
  }
}
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
      <navigation :route="`/ahligizi/diagnosa/diagnosa/edit/${id_rekam_pasien}`" title="Diagnosa" />
      <navigation
        :route="`/ahligizi/diagnosa/intervention/edit/${id_rekam_pasien}`"
        title="Intervensi"
      />
      <navigation :route="`/ahligizi/diagnosa/summary/edit/${id_rekam_pasien}`" title="Summary" />
    </div>
    <div class="w-full mx-4 h-auto bg-[#EAD3AF] my-4 rounded-lg overflow-hidden">
      <div class="bg-[#FAB12F] p-4 flex gap-3 text-2xl font-[jua] justify-between">
        <span class="cursor-pointer text-white"> Intervensi </span>
        <button
          class="bg-[#FA812F] text-white px-4 py-2 rounded-lg font-[jua]"
          @click="prediksiDiagnosa(id_rekam_pasien)"
        >
          Prediksi
        </button>
      </div>

      <div class="p-4 gap-4 mx-2 mb-2">
        <div class="w-full">
          <label for="Jenis Diet" class="text-xl font-[jua] mb-1">Jenis Diet:</label>
          <select
            class="h-11 w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F] font-[jua]"
            v-model="selectedIntervensiId"
          >
            <option :value="null">Select</option>
            <option v-for="opt in intervensiOptions" :key="opt.id" :value="opt.id">
              {{ opt.jenis_diet }}
            </option>
          </select>
        </div>
        <div class="w-full">
          <label for="Tujuan Diet" class="text-xl font-[jua] mb-1">Tujuan Diet:</label>
          <textarea
            id="Tujuan Diet"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            rows="5"
            v-model="tujuan"
          ></textarea>
        </div>
        <div class="w-full my-2">
          <label for="Prinsip Diet" class="text-xl font-[jua] mb-1">Prinsip Diet:</label>
          <textarea
            id="Prinsip Diet"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            rows="5"
            v-model="prinsip"
          ></textarea>
        </div>
        <label for="Rencana Diet" class="text-xl font-[jua] mb-1">Rencana Diet:</label>
        <div class="w-full grid grid-cols-3 gap-4 my-4">
          <div class="flex flex-row items-center">
            <label for="energi" class="text-md font-[jua] mb-1 w-1/3">Energi</label>
            <input
              type="number"
              id="energi"
              class="w-full rounded-xl border mx-4 p-1 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              v-model.number="energi"
            />
          </div>

          <div class="flex flex-row items-center">
            <label for="protein" class="text-md font-[jua] mb-1 w-1/3">Protein</label>
            <input
              type="number"
              id="protein"
              class="w-full rounded-xl border mx-4 p-1 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              v-model.number="protein"
            />
          </div>

          <div class="flex flex-row items-center">
            <label for="karbohidrat" class="text-md font-[jua] mb-1 w-1/3">Karbohidrat</label>
            <input
              type="number"
              id="karbohidrat"
              class="w-full rounded-xl border mx-4 p-1 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
              v-model.number="karbohidrat"
            />
          </div>
        </div>
        <div class="w-full my-2">
          <label for="Intervensi Edukasi" class="text-xl font-[jua] mb-1"
            >Intervensi Edukasi:</label
          >
          <textarea
            id="Intervensi Edukasi"
            class="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 bg-white focus:ring-[#FA812F]"
            rows="5"
            v-model="edukasi"
          ></textarea>
        </div>
        <div class="flex justify-end mx-6 my-4">
          <button
            type="button"
            @click="submitForm()"
            class="bg-[#FA812F] text-white px-4 py-2 rounded-lg font-[jua]"
          >
            Simpan
          </button>
          <button
            type="button"
            @click="setujui()"
            class="bg-[#FA812F] text-white px-4 py-2 rounded-lg font-[jua] mx-1"
          >
            Setujui
          </button>
        </div>
      </div>
    </div>
  </AhliGiziLayout>
</template>
