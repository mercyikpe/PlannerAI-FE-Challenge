<template>
  <header class="my-5 w-11/12">
    <h1 class="text-2xl font-bold text-center">
      AI-based ordering recommendation <span class="block">vs</span> Actual Demand quantity
    </h1>
  </header>

  <main class="mt-20 mb-10 w-10/12 mx-auto max-w-[2000px]">
    <section class="max-w-5xl mx-auto flex gap-10 justify-between">
      <div class="flex flex-wrap md:flex-nowrap gap-6 w-full">
        <div class="space-y-0.5 w-full md:w-1/2">
          <label for="basic" class="font-medium text-slate-500">Filter by Store</label>
          <select
            id="store"
            v-model="selectedStore"
            class="block w-full rounded-md text-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 truncate border-slate-300"
          >
            <!-- Loop through storeData and generate options -->
            <option v-for="store in storeData" :key="store.id_store" :value="store.id_store">
              {{ store.store_label }}
            </option>
          </select>
        </div>

        <div class="space-y-0.5 w-full md:w-1/2">
          <label for="product" class="font-medium text-slate-500">filter by Product</label>
          <select
            id="product"
            v-model="selectedProduct"
            class="block w-full rounded-md text-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 truncate border-slate-300"
          >
            <!-- Loop through productData and generate options -->
            <option
              v-for="product in productData"
              :key="product.id_product"
              :value="product.id_product"
            >
              {{ product.name_product }}
            </option>
          </select>
        </div>
      </div>

      <div class="w-full">
        <div class="space-y-0.5 sm:w-1/2 ml-auto">
          <label for="dateRange" class="font-medium text-slate-500">Filter by Weeks</label>
          <select
            id="dateRange"
            v-model="selectedDateRange"
            class="block w-full rounded-md text-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 truncate border-slate-300"
          >
            <option value="">All weeks</option>
            <!-- Loop through dateRangeOptions and generate options -->
            <option v-for="dateOption in dateRangeOptions" :key="dateOption">
              {{ dateOption }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="max-w-5xl mx-auto mt-10 h-[50vh]">
      <Line :datasets="datasets" />
    </section>
  </main>
</template>

<script lang="ts" setup>
import Line from '@/Chart/Line.vue'
import dayjs from 'dayjs'

import { computed, onBeforeMount, onMounted, ref } from 'vue'
import api, { Delivery, Order, Product, Recommendation, Store } from '@/api'
import {
  createDateRange,
  filterByStoreProductDate,
  sortDatasetsByTargetDate,
  StoreProductDateFilter
} from '@/util'
import type { ChartDataset } from '@/Chart/types'

const selectedStore = ref<number | null>(null)
const selectedProduct = ref<number | null>(null)

const productData = ref<Product[]>([])
const storeData = ref<Store[]>([])
const recommendationData = ref<Recommendation[]>([])
const deliveryData = ref<Delivery[]>([])
const salesData = ref<Order[]>([])

const selectedDateRange = ref('')

async function fetchAnalysisData(): Promise<void> {
  await Promise.all([
    api.product.list().then((data) => (productData.value = data)),
    api.delivery.list().then((data) => (deliveryData.value = data)),
    api.sales.list().then((data) => (salesData.value = data)),
    api.stores.list().then((data) => (storeData.value = data)),
    api.recommendation.list().then((data) => (recommendationData.value = data))
  ])
}

const dateRangeOptions = computed(() => {
  const allDates = [
    ...recommendationData.value.map((item) => item.target_date),
    ...deliveryData.value.map((item) => item.target_date),
    ...salesData.value.map((item) => item.target_date)
  ]

  // Sort the array of dates
  allDates.sort()

  const dateOptions = []

  let currentDate = dayjs(allDates[0]) // Start with the earliest date

  while (currentDate.isBefore(dayjs(allDates[allDates.length - 1]))) {
    const nextWeek = currentDate.add(1, 'week')
    dateOptions.push(
      createDateRange(
        currentDate.format('YYYY-MM-DD'),
        nextWeek.subtract(1, 'day').format('YYYY-MM-DD')
      )
    )
    currentDate = nextWeek
  }

  return dateOptions
})

const filter = computed((): StoreProductDateFilter => {
  return {
    date: selectedDateRange.value,
    store: selectedStore.value,
    product: selectedProduct.value
  }
})
const recommendations = computed(() => {
  return filterByStoreProductDate(recommendationData.value, filter.value)
})

const sales = computed(() => {
  return filterByStoreProductDate(salesData.value, filter.value)
})

const datasets = computed((): ChartDataset[] => {
  let adjustments = []

  // Process data and calculate differences between recommendation, delivery, and sales
  for (const recommendation of recommendations.value) {
    const matchingDelivery = deliveryData.value.find(
      (delivery) =>
        delivery.target_date === recommendation.target_date &&
        delivery.id_store === recommendation.id_store &&
        delivery.id_product === recommendation.id_product
    )

    if (!matchingDelivery) {
      continue
    }

    let improved = false
    const matchingSales = salesData.value.find(
      (sales) =>
        sales.target_date === recommendation.target_date &&
        sales.id_store === recommendation.id_store &&
        sales.id_product === recommendation.id_product
    )

    if (matchingSales) {
      const actualDemand = matchingSales.demand_qty
      improved =
        matchingDelivery.delivery_qty - actualDemand < recommendation.recommendation - actualDemand
    }

    adjustments.push({
      x: recommendation.target_date,
      y: recommendation.recommendation - matchingDelivery.delivery_qty,
      rec: recommendation.recommendation,
      delivery: matchingDelivery.delivery_qty,
      improved,
      type: 'adjustments'
    })
  }

  let salesDataset = []
  for (const sale of sales.value) {
    salesDataset.push({
      x: sale.target_date,
      y: sale.demand_qty - sale.sales_qty,
      type: 'adjustments'
    })
  }

  return [
    {
      label: 'AI Recommendation and Adjustments difference',
      data: sortDatasetsByTargetDate(adjustments),
      backgroundColor: 'rgba(248, 121, 121, 0.5)',
      borderColor: 'rgba(248, 121, 121, 1)',
      borderWidth: 1
    },
    {
      label: 'Actual delivery quantity',
      data: sortDatasetsByTargetDate(salesDataset),
      backgroundColor: 'rgba(29, 75, 114, 0.5)',
      borderColor: 'rgba(29, 75, 114, 1)',
      borderWidth: 1
    }
  ]
})

onMounted(() => {})

onBeforeMount(async () => {
  await fetchAnalysisData()

    // select the first store before component is mounted
  if (storeData.value.length > 0) {
    selectedStore.value = storeData.value[0].id_store
  }

    // select the first product  before component is mounted
  if (productData.value.length > 0) {
    selectedProduct.value = productData.value[0].id_product
  }
})
</script>
