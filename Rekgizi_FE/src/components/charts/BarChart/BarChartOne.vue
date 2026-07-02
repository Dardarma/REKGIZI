<template>
  <div class="w-full overflow-x-auto custom-scrollbar">
    <div class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
      <VueApexCharts
        type="bar"
        :height="height"
        :options="chartOptions"
        :series="seriesData"
      />
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
  height: {
    type: [Number, String],
    required: false,
    default: 180,
  },
})

const chartOptions = computed(() => ({
  colors: ['#FA812F'],
  chart: {
    fontFamily: 'jua',
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: props.categories,
    labels: {
      show: true,
      hideOverlappingLabels: false,
      trim: false,
      rotate: 0,
      style: {
        fontSize: '11px',
        fontFamily: 'jua',
      },
      formatter: function(val) {
        if (!val || typeof val !== 'string') return val
        const words = val.split(' ')
        const lines = []
        let currentLine = ''
        for (const word of words) {
          if ((currentLine + ' ' + word).trim().length > 15) {
            if (currentLine) lines.push(currentLine)
            currentLine = word
          } else {
            currentLine = currentLine ? currentLine + ' ' + word : word
          }
        }
        if (currentLine) lines.push(currentLine)
        return lines
      }
    },
    axisBorder: {
      show: true,
      color: '#000000',
    },
    axisTicks: {
      show: true,
      color: '#000000',
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    markers: { radius: 99 },
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: '#000000',
    },
    axisTicks: {
      show: true,
      color: '#000000',
    },
  },
  grid: {
    borderColor: '#000000',
    yaxis: { lines: { show: false } },
    xaxis: { lines: { show: false } },
  },
  fill: { opacity: 1 },
  tooltip: {
    theme: 'dark',
    style: { fontFamily: 'jua', fontSize: '12px' },
    x: {
      show: true,
      formatter: function(val, { dataPointIndex }) {
        return props.categories[dataPointIndex] || val
      }
    },
    y: {
      formatter(val) {
        return val.toString()
      },
    },
  },
}))
</script>
