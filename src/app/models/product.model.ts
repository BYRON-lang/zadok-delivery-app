export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  storeId: string;
  available: boolean;
  quantity: number;
}

export enum ProductCategory {
  FOOD = 'food',
  GROCERY = 'grocery',
  MEDICINE = 'medicine',
  DESSERTS = 'desserts',
  HEALTHY = 'healthy',
  DRINKS = 'drinks',
  SNACKS = 'snacks',
  ETHNIC = 'ethnic'
}
