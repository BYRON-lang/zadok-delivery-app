import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AIRecommendation, RecommendedProduct, RecommendedStore, RecommendationType, ARContent } from '../models/recommendation.model';
import { AuthService } from './auth.service';
import { OrderService } from './order.service';
import { Store } from '../models/store.model';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private recommendationsSubject = new BehaviorSubject<AIRecommendation | null>(null);
  public recommendations$ = this.recommendationsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {
    this.initializeRecommendations();
  }

  private initializeRecommendations() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Mock AI-generated recommendations
    const mockRecommendation: AIRecommendation = {
      id: 'REC' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id!,
      products: this.generateMockRecommendedProducts(),
      stores: this.generateMockRecommendedStores(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      context: {
        timeOfDay: this.getTimeOfDay(),
        weather: 'sunny', // In real app, this would come from a weather API
        userPreferences: ['Healthy', 'Fast Delivery', 'Vegetarian'],
        recentOrders: ['1001', '1002'],
        specialEvents: ['Weekend Special']
      }
    };

    this.recommendationsSubject.next(mockRecommendation);
  }

  private generateMockRecommendedProducts(): RecommendedProduct[] {
    return [
      {
        id: 'P1',
        name: 'Smart Meal Box',
        description: 'AI-curated balanced meal with optimal nutrition',
        price: 15.99,
        image: 'assets/images/products/smart-meal.jpg',
        category: ProductCategory.FOOD,
        storeId: 'S1',
        available: true,
        quantity: 50,
        confidence: 0.95,
        reasonForRecommendation: 'Based on your health preferences and past orders',
        similarProducts: []
      },
      {
        id: 'P2',
        name: 'Eco-Friendly Food Container',
        description: 'Smart temperature-maintaining container',
        price: 25.99,
        image: 'assets/images/products/eco-container.jpg',
        category: ProductCategory.FOOD,
        storeId: 'S2',
        available: true,
        quantity: 30,
        confidence: 0.85,
        reasonForRecommendation: 'Complements your frequent food deliveries',
        similarProducts: []
      }
    ];
  }

  private generateMockRecommendedStores(): RecommendedStore[] {
    return [
      {
        id: 'S1',
        name: 'Future Foods',
        description: 'AI-powered kitchen with personalized meals',
        address: '123 Innovation Street, Harare',
        image: 'assets/images/stores/future-foods.jpg',
        categories: [ProductCategory.FOOD],
        rating: 4.8,
        deliveryTime: '20-30 min',
        deliveryFee: 2.00,
        isOpen: true,
        openingHours: '08:00',
        closingHours: '22:00',
        tags: ['Smart Kitchen', 'Personalized', 'Healthy'],
        featured: true,
        city: 'Harare',
        province: 'Harare',
        confidence: 0.92,
        reasonForRecommendation: 'Matches your dietary preferences',
        arContent: this.generateMockARContent('S1')
      }
    ];
  }

  private generateMockARContent(storeId: string): ARContent {
    return {
      id: 'AR' + storeId,
      storeId: storeId,
      modelUrl: 'assets/ar-models/store-' + storeId + '.glb',
      previewImage: 'assets/images/ar-previews/store-' + storeId + '.jpg',
      hotspots: [
        {
          id: 'H1',
          position: { x: 1.5, y: 1.2, z: -0.5 },
          title: 'Special Offer Zone',
          description: 'Check out our daily AI-curated specials',
          type: 'promotion'
        },
        {
          id: 'H2',
          position: { x: -1.0, y: 1.5, z: 0.8 },
          title: 'Personalized Menu',
          description: 'View menu items tailored to your preferences',
          type: 'info'
        }
      ],
      lastUpdated: new Date()
    };
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  getRecommendations(): Observable<AIRecommendation | null> {
    return this.recommendations$;
  }

  getARContentForStore(storeId: string): Observable<ARContent | null> {
    return this.recommendations$.pipe(
      map(rec => rec?.stores.find(store => store.id === storeId)?.arContent || null)
    );
  }

  refreshRecommendations(): Observable<boolean> {
    this.initializeRecommendations();
    return of(true).pipe(delay(1000)); // Simulate network delay
  }
}