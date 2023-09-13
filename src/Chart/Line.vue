<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script lang="ts" setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'

import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm'
import { computed, PropType, reactive } from 'vue'
import type { ChartDataset } from '@/Chart/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

const props = defineProps({
  datasets: {
    type: Array as PropType<ChartDataset[]>,
    default: () => []
  }
})

const chartData = computed(() => {
  return {
    datasets: props.datasets
  }
})

const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    point: {
      radius: (context) => {
        if (!context.raw || !context.raw.type) {
          return 2
        }

        return context.raw.improved ? 10 : 2
      }
    }
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        displayFormats: {
          quarter: 'MMM YYYY'
        }
      }
    }
  }
})
</script>
