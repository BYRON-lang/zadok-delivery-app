import { Product } from './product.model';
import { Store } from './store.model';

export interface AIRecommendation {
  id: string;
  userId: string;
  products: RecommendedProduct[];
  stores: RecommendedStore[];
  createdAt: Date;
  expiresAt: Date;
  context: RecommendationContext;
}

export interface RecommendedProduct extends Product {
  confidence: number;
  reasonForRecommendation: string;
  similarProducts: Product[];
}

export interface RecommendedStore extends Store {
  confidence: number;
  reasonForRecommendation: string;
  arContent?: ARContent;
}

export interface RecommendationContext {
  timeOfDay: string;
  weather: string;
  userPreferences: string[];
  recentOrders: string[];
  specialEvents?: string[];
}

export interface ARContent {
  id: string;
  storeId: string;
  modelUrl: string;
  previewImage: string;
  hotspots: ARHotspot[];
  lastUpdated: Date;
}

export interface ARHotspot {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  title: string;
  description: string;
  productId?: string;
  type: 'product' | 'info' | 'promotion';
}

export enum RecommendationType {
  PERSONALIZED = 'personalized',
  TRENDING = 'trending',
  WEATHER_BASED = 'weather_based',
  TIME_SENSITIVE = 'time_sensitive',
  EVENT_BASED = 'event_based'
}