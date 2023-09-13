export interface Product {
  id_product: number
  name_product: string
  number_product: number
  price: number
}

export interface Store {
  id_store: number
  store_label: string
  number_store: number
}

export interface Recommendation {
  id_store: number
  id_product: number
  target_date: string
  recommendation: number
  recommendation_value_by_price: number
}

export interface Delivery {
  id_store: number
  id_product: number
  target_date: string
  delivery_qty: number
  delivery_value_by_price: number
}

export interface Order {
  id_store: number
  id_product: number
  target_date: string
  sales_qty: number
  sales_value: number
  demand_qty: number
  demand_value: number
}

class OrderApi {
  public list(): Promise<Order[]> {
    return fetch('/data/sales.json').then((response) => response.json())
  }
}

class StoreApi {
  public list(): Promise<Store[]> {
    return fetch('/data/stores.json').then((response) => response.json())
  }
}

class DeliveryApi {
  public list(): Promise<Delivery[]> {
    return fetch('/data/deliveries.json').then((response) => response.json())
  }
}

class RecommendationApi {
  public list(): Promise<Recommendation[]> {
    return fetch('/data/recommendations.json').then((response) => response.json())
  }
}

class ProductApi {
  public list(): Promise<Product[]> {
    return fetch('/data/products.json').then((response) => response.json())
  }
}

export default {
  sales: new OrderApi(),
  stores: new StoreApi(),
  delivery: new DeliveryApi(),
  recommendation: new RecommendationApi(),
  product: new ProductApi()
}
