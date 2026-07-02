<template>
  <AhliGiziLayout>
    <div class="mb-5 flex flex-col gap-3 rounded-lg bg-[#FFEBCD] p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="font-[jua] text-2xl font-bold">Dashboard Ahli Gizi</h1>
        <p class="font-[jua] text-sm text-gray-600">Periode {{ periodLabel }}</p>
      </div>
      <div class="flex items-center gap-3 font-[jua]">
        <label for="dashboard-month" class="text-sm font-medium">Bulan</label>
        <select
          id="dashboard-month"
          v-model.number="selectedMonth"
          class="rounded-lg border border-[#FAB12F] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
        >
          <option v-for="month in monthOptions" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <label for="dashboard-year" class="text-sm font-medium">Tahun</label>
        <select
          id="dashboard-year"
          v-model.number="selectedYear"
          class="rounded-lg border border-[#FAB12F] bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <div :class="isLoading ? 'pointer-events-none opacity-60' : ''" class="transition-opacity">
    <div class="flex flex-col gap-5 w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <CaseCard title="Total Case" :date="periodLabel" :total="totalSebulan?.total_case ?? 0" />
        <CaseCard title="Approved Diagnose" :date="periodLabel" :total="totalSebulan?.total_approved ?? 0" />
        <CaseCard title="Total Appointment" :date="periodLabel" :total="totalSebulan?.total_appoinment ?? 0" />
        <CaseCard title="Total Article" :date="periodLabel" :total="totalSebulan?.total_article ?? 0" />
      </div>
    </div>
    <div class="flex flex-col gap-5 w-full my-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full">
        <ContainerConten :title="`Kasus per Minggu — ${periodLabel}`">
          <BarChartOne :seriesData="dataMingguan" :categories="categoriesSebulan" />
        </ContainerConten>
        <ContainerConten :title="`Persebaran Usia — ${periodLabel}`">
          <PieChart :seriesData="dataUsia" :categories="categorUsia" />
        </ContainerConten>
      </div>
    </div>
    <div class="flex flex-col gap-5 w-full my-5">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch w-full">
        <ContainerConten :title="`Persetujuan Rekam Pasien — ${periodLabel}`" class="scrollbar max-h-[400px]">
          <div class="flex flex-col gap-3">
            <Aprovalbox
              v-for="(item, i) in user"
              :key="i"
              :username="item.nama_pasien"
              :status="item.status"
              :date="item.tanggal_asesmen"
              :id="item.id"
            />
          </div>
        </ContainerConten>
        <ContainerConten :title="`Persebaran Diet — ${periodLabel}`">
          <BarChartOne :seriesData="dataRendahProtein" :categories="categoriesRendahProtein" :height="280" />
        </ContainerConten>
      </div>
    </div>
    </div>
  </AhliGiziLayout>
</template>
<script setup lang="ts">
import AhliGiziLayout from '@/components/layout/Ahligizi/AhliGiziLayout.vue'
import CaseCard from '@/components/costumeComponents/dashboard/caseCard.vue'
import ContainerConten from '@/components/costumeComponents/dashboard/containerConten.vue'
import BarChartOne from '@/components/charts/BarChart/BarChartOne.vue'
import PieChart from '@/components/charts/PieChart/pieChart.vue'
import Aprovalbox from '@/components/costumeComponents/dashboard/Aprovalbox.vue'
import { computed, ref, watch } from 'vue'
import { getPersebaranKasusDiet, getPersebaranMingguan, getPersebaranUsia, getRekamPasienDashboard, getTotalInformation } from '@/service/ahliGizi/dashboard'
import Swal from 'sweetalert2'

interface TotalPerbulan{
  total_case: number
  total_approved: number
  total_appoinment: number
  total_article: number
  tahun: number
  bulan: number
}

interface ChartSeries {
  name: string
  data: number[]
}

interface rekamPasien {
  nama_pasien: string
  status: string
  tanggal_asesmen: string
  id: number
}

const totalSebulan = ref<TotalPerbulan | null>(null)

const dataMingguan = ref<ChartSeries[]>([])
const categoriesSebulan = ref<string[]>([])

const dataUsia = ref<number[]>([])
const categorUsia = ref<string[]>([])

const dataRendahProtein = ref<ChartSeries[]>([])
const categoriesRendahProtein = ref<string[]>([])

const user = ref<rekamPasien[]>([])
const isLoading = ref(false)

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())
const yearOptions = Array.from({ length: 11 }, (_, index) => now.getFullYear() - index)
const monthOptions = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
].map((label, index) => ({ label, value: index + 1 }))

const ageCategoryOrder = ['< 40 tahun', '40 - 49 tahun', '50 - 59 tahun', '60 - 69 tahun', '>= 70 tahun']

const periodLabel = computed(() => {
  const month = monthOptions.find((item) => item.value === selectedMonth.value)
  return `${month?.label ?? '-'} ${selectedYear.value}`
})

let requestSequence = 0

function sortAgeDistribution(categories: string[], values: number[]) {
  const valueByCategory = new Map(categories.map((category, index) => [category, values[index] ?? 0]))

  return {
    categories: ageCategoryOrder,
    values: ageCategoryOrder.map((category) => valueByCategory.get(category) ?? 0),
  }
}

async function fetchDashboard() {
  const sequence = ++requestSequence
  isLoading.value = true
  const period = { month: selectedMonth.value, year: selectedYear.value }
  try {
    const [totalData, weeklyData, dietData, ageData, patientData] = await Promise.all([
      getTotalInformation(period),
      getPersebaranMingguan(period),
      getPersebaranKasusDiet(period),
      getPersebaranUsia(period),
      getRekamPasienDashboard(period),
    ])

    if (sequence !== requestSequence) return

    totalSebulan.value = totalData.data
    dataMingguan.value = weeklyData.data.seriesData
    categoriesSebulan.value = weeklyData.data.categories
    dataRendahProtein.value = dietData.data.seriesData
    categoriesRendahProtein.value = dietData.data.categories
    const sortedAgeData = sortAgeDistribution(
      ageData.data.categories || [],
      ageData.data.seriesData[0]?.data || [],
    )
    dataUsia.value = sortedAgeData.values
    categorUsia.value = sortedAgeData.categories
    user.value = patientData.data.data
  } catch (error) {
    if (sequence !== requestSequence) return
    await Swal.fire({
      icon: 'error',
      title: 'Gagal mengambil data dashboard',
      text: 'Data untuk periode yang dipilih tidak dapat dimuat.',
    })
  } finally {
    if (sequence === requestSequence) isLoading.value = false
  }
}

watch([selectedMonth, selectedYear], fetchDashboard, { immediate: true })
</script>
