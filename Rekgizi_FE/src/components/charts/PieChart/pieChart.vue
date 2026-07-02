<template>
  <div class="pie-chart w-full overflow-x-auto custom-scrollbar">
    <div class="-ml-5 min-w-[300px] xl:min-w-full pl-2">
      <VueApexCharts type="pie" height="250" :options="chartOptions" :series="seriesData" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  seriesData: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: false,
    default: () => ['#2B9015', '#8C5A2B', '#F9A825', '#EF6C00', '#C62828', '#6A1B9A', '#00897B'],
  },
})

const chartOptions = computed(() => ({
  colors: props.colors,
  chart: {
    type: 'pie',
    fontFamily: 'jua',
  },

  labels: props.categories,

  legend: {
    position: 'bottom',
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#FFFFFF'],
      fontFamily: 'jua',
      fontWeight: 600,
    },
  },

  tooltip: {
    theme: 'light',
    style: { fontFamily: 'jua', fontSize: '12px' },
    y: {
      formatter(val) {
        return val.toString()
      },
    },
  },
}))
</script>

<style scoped>
.pie-chart :deep(.apexcharts-pie-label),
.pie-chart :deep(.apexcharts-datalabel),
.pie-chart :deep(.apexcharts-data-labels text) {
  fill: #ffffff !important;
  color: #ffffff !important;
}
</style>
