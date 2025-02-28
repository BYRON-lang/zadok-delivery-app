import { ProductCategory } from './product.model';

export interface Store {
  id?: string;
  name: string;
  description: string;
  address: string;
  image: string;
  categories: ProductCategory[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  latitude?: number;
  longitude?: number;
  isOpen: boolean;
  openingHours: string;
  closingHours: string;
  tags: string[];
  featured?: boolean;
  minimumOrder?: number;
  city: string;
  province: string;
}
