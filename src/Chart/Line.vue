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
          return 4
        }

        return context.raw.improved ? 10 : 4
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
  },
  plugins: {
    tooltip: {
      enabled: true,
      filter: false,
        callbacks: {
            label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const improved = context.raw.improved;

                let improvementText: string = '';
                if (value !== 0) {
                    improvementText = improved ? 'Improved' : 'Deteriorated';
                }
                // Apply custom formatting only for the "Recommendation and delivery difference" dataset
                if (label === 'Recommendation and delivery difference') {
                    return `${label}: ${value} ${improvementText}`;
                } else {
                    // For other datasets, return plain text with the value
                    return `${label}: ${value}`;
                }
            }
        },

      backgroundColor: (context) => {
        const value = context.raw?.y
        if (value !== undefined && value !== 0) {
          const improved = context.raw?.data?.improved || false
          // return improved ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'
          return improved ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)'
        }
        return ''
      }
    }
  }
})
</script>
