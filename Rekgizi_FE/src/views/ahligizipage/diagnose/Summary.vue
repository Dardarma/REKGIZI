<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import navigation from '@/components/costumeComponents/ahliGizi/navigation.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { getSummary } from '@/service/ahliGizi/diagnosa/asuhan_intervensi'
import { formatTanggal } from '@/utils/formatTanggal'

const route = useRoute()
const id_rekam_pasien = Number(route.params.id)

const isEdit = computed(() => route.path.includes('edit'))
const isCreate = computed(() => route.path.includes('create'))
const summary = ref<RekamPasienSummary | null>(null)

onMounted(async () => {
  mapSummary()
})
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

async function mapSummary() {
  try {
    const res = await getSummary(id_rekam_pasien)

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
    console.error('Gagal ambil summary:', error)
    summary.value = null
  }
}

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
        <span class="cursor-pointer text-white"> Summary </span>
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
          <p class="font-[jua] text-md p-4" v-for="item in summary?.diagnosa">
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
  </AhliGiziLayout>
</template>
