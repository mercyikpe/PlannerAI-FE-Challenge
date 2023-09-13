import dayjs from 'dayjs'
import type { Coordinate } from '@/Chart/types'
import type { Delivery, Order, Recommendation } from '@/api'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)

const DATE_RANGE_SEPARATOR = ' - '

export function sortDatasetsByTargetDate(dataset: Coordinate[]): Coordinate[] {
  return dataset.sort((a, b) => {
    if (dayjs(a.x, 'YYYY-MM-DD').isAfter(dayjs(b.x, 'YYYY-MM-DD'))) {
      return 1
    }

    if (dayjs(a.x, 'YYYY-MM-DD').isBefore(dayjs(b.x, 'YYYY-MM-DD'))) {
      return -1
    }

    return 0
  })
}

export interface StoreProductDateFilter {
  date: string
  product: number | null
  store: number | null
}

export function filterByStoreProductDate<T extends Order | Recommendation | Delivery>(
  list: T[],
  filter: StoreProductDateFilter
): T[] {
  return list.filter((item) => {
    const selected = item.id_store === filter.store && item.id_product === filter.product
    if (!filter.date) {
      return selected
    }

    const [currentDate, nextWeek] = splitDateRange(filter.date)
    return selected && dayjs(item.target_date).isBetween(dayjs(currentDate), dayjs(nextWeek))
  })
}

export function createDateRange(from: string, to: string): string {
  return `${from}${DATE_RANGE_SEPARATOR}${to}`
}

export function splitDateRange(dateRange: string): string[] {
  return dateRange.split(DATE_RANGE_SEPARATOR, 2)
}
