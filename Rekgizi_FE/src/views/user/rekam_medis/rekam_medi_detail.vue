<template>
  <UserLayout>
    <div class="w-full mx-4 h-auto bg-[#EAD3AF] my-4 rounded-lg overflow-hidden">
      <div class="bg-[#FAB12F] p-4 flex gap-3 text-2xl font-[jua] justify-between items-center">
        <div class="flex items-center gap-4">
          <router-link
            to="/user/rekam-medis"
            class="bg-[#FA812F] p-2 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </router-link>
          <span class="cursor-pointer text-white"> Summary </span>
        </div>
        <span
          :class="[
            statusClass[summary?.status || 'belum_ditinjau'],
            'text-white text-xl font-medium px-3 py-1 rounded-full',
          ]"
        >
          {{ statusLabel[summary?.status || 'belum_ditinjau'] }}
        </span>
      </div>

      <div class="bg-[#FAB12F] p-1 m-2 flex items-center text-xl font-[jua]">
        <span class="text-black"> Biodata </span>
      </div>
      <div class="w-full grid grid-cols-2 gap-4 my-4 mx-4">
        <div class="flex flex-row items-center">
          <label for="energi" class="text-md font-[jua] mb-1 w-1/3">Nama</label>
          <p class="font-[jua] text-md">: {{ summary?.nama }}</p>
        </div>

        <div class="flex flex-row items-center">
          <label for="protein" class="text-md font-[jua] mb-1 w-1/3">Gender</label>
          <p class="font-[jua] text-md">: {{ summary?.jenis_kelamin }}</p>
        </div>

        <div class="flex flex-row items-center">
          <label for="karbohidrat" class="text-md font-[jua] mb-1 w-1/3">Tanggal Assesment</label>
          <p class="font-[jua] text-md">: {{ formatTanggal(summary?.tanggal_asesmen) }}</p>
        </div>

        <div class="flex flex-row items-center">
          <label for="karbohidrat" class="text-md font-[jua] mb-1 w-1/3">Usia </label>
          <p class="font-[jua] text-md">: {{ summary?.usia }}</p>
        </div>

        <div class="flex flex-row items-center">
          <label for="karbohidrat" class="text-md font-[jua] mb-1 w-1/3">Alamat</label>
          <p class="font-[jua] text-md">: {{ summary?.alamat.lengkap }}</p>
        </div>
      </div>

      <div v-for="(items, kategori) in groupedParameter" :key="kategori">
        <!-- Header -->
        <div class="bg-[#FAB12F] p-1 m-2 flex items-center text-xl font-[jua]">
          <span class="text-black capitalize">{{ kategori }}</span>
        </div>

        <!-- Isi -->
        <div class="w-full grid grid-cols-3 gap-4 my-4 mx-4">
          <div v-for="item in items" :key="item.nama_parameter" class="flex flex-row items-center">
            <label class="text-md font-[jua] mb-1 w-1/3">
              {{ item.nama_parameter }}
            </label>

            <p class="font-[jua] text-md">: {{ item.jawaban ?? '-' }}</p>
          </div>
        </div>
      </div>

      <div class="bg-[#FAB12F] p-1 m-2 flex items-center text-xl font-[jua]">
        <span class="text-black"> Diagnosa </span>
      </div>

      <div class="p-4 gap-4 mx-2 mb-2">
        <div class="w-full">
          <p class="font-[jua] text-md p-4" v-for="item in summary?.diagnosa" :key="item.kode">
            {{ item.kode }} - {{ item.diagnosa }}
          </p>
        </div>
      </div>

      <div class="bg-[#FAB12F] p-1 m-2 flex items-center text-xl font-[jua]">
        <span class="text-black"> Intervensi </span>
      </div>

      <div class="p-4 gap-4 mx-2 mb-2">
        <div class="w-full">
          <label for="Jenis Diet" class="text-xl font-[jua] mb-1">Jenis Diet:</label>
          <p class="font-[jua] text-md p-4">{{ summary?.jenis_diet }}</p>
        </div>
        <div class="w-full">
          <label for="Tujuan Diet" class="text-xl font-[jua] mb-1">Tujuan Diet:</label>
          <p class="font-[jua] text-md p-4">{{ summary?.tujuan_intervensi }}</p>
        </div>
        <div class="w-full my-2">
          <label for="Prinsip Diet" class="text-xl font-[jua] mb-1">Prinsip Diet:</label>
          <p class="font-[jua] text-md p-4">{{ summary?.prinsip_intervensi }}</p>
        </div>
        <label for="Rencana Diet" class="text-xl font-[jua] mb-1">Rencana Diet:</label>
        <div class="w-full grid grid-cols-3 gap-4 my-4">
          <div class="flex flex-row items-center">
            <label for="energi" class="text-md font-[jua] mb-1 w-1/3">Energi :</label>
            <p class="font-[jua] text-md">{{ summary?.energi }}</p>
          </div>

          <div class="flex flex-row items-center">
            <label for="protein" class="text-md font-[jua] mb-1 w-1/3">Protein :</label>
            <p class="font-[jua] text-md">{{ summary?.protein }}</p>
          </div>

          <div class="flex flex-row items-center">
            <label for="karbohidrat" class="text-md font-[jua] mb-1 w-1/3">Karbohidrat :</label>
            <p class="font-[jua] text-md">{{ summary?.karbohidrat }}</p>
          </div>
        </div>
        <div class="w-full my-2">
          <label for="Intervensi Edukasi" class="text-xl font-[jua] mb-1"
            >Intervensi Edukasi:</label
          >
          <p class="font-[jua] text-md p-4">{{ summary?.edukasi_intervensi }}</p>
        </div>
      </div>
    </div>
  </UserLayout>
</template>

<script setup lang="ts">
import UserLayout from '@/components/layout/user/UserLayout.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSummary } from '@/service/ahliGizi/diagnosa/asuhan_intervensi'
import { formatTanggal } from '@/utils/formatTanggal'
import { computed } from 'vue'

import Swal from 'sweetalert2'

const route = useRoute()
const id = Number(route.params.id)
const summary = ref<RekamPasienSummary | null>(null)

onMounted(async ()=>{
 fetcSummary()
} )

interface Alamat {
  desa: string
  kecamatan: string
  kota: string
  provinsi: string
  lengkap: string
}
interface ParameterItem {
  nama_parameter: string
  kategori: string
  jawaban: string | null
}

interface DiagnosaItem {
  kode: string
  diagnosa: string
}
interface RekamPasienSummary {
  nama: string
  jenis_kelamin: string
  alamat: Alamat
  usia: number
  tanggal_asesmen: Date
  status: string

  tujuan_intervensi?: string
  prinsip_intervensi?: string
  edukasi_intervensi?: string

  jenis_diet?: string
  protein?: number
  energi?: number
  karbohidrat?: number

  parameter: ParameterItem[]
  diagnosa: DiagnosaItem[]
}

async function fetcSummary() {
  try {
    const res = await getSummary(id)

    const data = res.data

    summary.value = {
      nama: data.nama,
      jenis_kelamin: data.jenis_kelamin,
      alamat: {
        desa: data.alamat.desa,
        kecamatan: data.alamat.kecamatan,
        kota: data.alamat.kota,
        provinsi: data.alamat.provinsi,
        lengkap: data.alamat.lengkap,
      },
      usia: data.usia,
      tanggal_asesmen: data.tanggal_asesmen,
      status: data.status,

      tujuan_intervensi: data.tujuan_intervensi,
      prinsip_intervensi: data.prinsip_intervensi,
      edukasi_intervensi: data.edukasi_intervensi,

      jenis_diet: data.jenis_diet,
      protein: data.protein,
      energi: data.energi,
      karbohidrat: data.karbohidrat,

      parameter: data.parameter.map((p: any) => ({
        nama_parameter: p.nama_parameter,
        kategori: p.kategori,
        jawaban: p.jawaban,
      })),

      diagnosa: Array.from(new Map(data.diagnosa.map((d: any) => [d.kode, d])).values()).map(
        (d: any) => ({
          kode: d.kode,
          diagnosa: d.diagnosa,
        }),
      ),
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Gagal mengambil summary',
    })
  }
}

const groupedParameter = computed(() => {
  if (!summary.value) return {}

  return summary.value.parameter.reduce((acc: Record<string, ParameterItem[]>, item) => {
    const key = item.kategori || 'lainnya'

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(item)
    return acc
  }, {})
})

const statusClass: Record<string, string> = {
  belum_ditinjau: 'bg-red-500',
  ditinjau: 'bg-blue-500',
  disetujui: 'bg-green-500',
}

const statusLabel: Record<string, string> = {
  belum_ditinjau: 'Belum Ditinjau',
  ditinjau: 'Ditinjau',
  disetujui: 'Disetujui',
}
</script>
