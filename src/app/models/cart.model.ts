import { Product } from './product.model';
import { Store } from './store.model';

export interface CartItem {
  product: Product;
  quantity: number;
  store: Store;
}

export interface Cart {
  items: CartItem[];
  store: Store | null;
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  promoDiscount?: number;
}