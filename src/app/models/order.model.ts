import { Product, ProductCategory } from './product.model';
import { Store } from './store.model';
import { User } from './user.model';

export { ProductCategory };

export interface CartItem {
  product: Product;
  quantity: number;
  store: Store;
}

export interface Order {
  id?: string;
  items: CartItem[];
  user: User;
  store: Store;
  status: OrderStatus;
  subtotal: number;
  total: number;
  deliveryAddress: string;
  deliveryFee: number;
  serviceFee: number;
  discount?: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
  contactPhone?: string;
  deliveryInstructions?: string;
  specialInstructions?: string;
  isPickup: boolean;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  IN_PROGRESS = 'in_progress',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH = 'cash',
  ECOCASH = 'ecocash',
  TELECASH = 'telecash',
  ONEMONEY = 'onemoney',
  VISA = 'visa',
  MASTERCARD = 'mastercard'
}
