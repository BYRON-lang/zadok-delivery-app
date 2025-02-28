import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Store } from '../models/store.model';
import { ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Mock data for stores
  private mockStores: Store[] = [
    {
      id: '1',
      name: 'Chicken Inn',
      description: 'Zimbabwe\'s favorite fried chicken restaurant',
      address: 'Sam Nujoma Street, Harare',
      image: 'assets/images/stores/chicken-inn.jpg',
      categories: [ProductCategory.FOOD],
      rating: 4.5,
      deliveryTime: '25-35 min',
      deliveryFee: 2.50,
      latitude: -17.824858,
      longitude: 31.053028,
      isOpen: true,
      openingHours: '08:00',
      closingHours: '22:00',
      tags: ['Fast Food', 'Chicken', 'Burgers'],
      featured: true,
      city: 'Harare',
      province: 'Harare'
    },
    {
      id: '2',
      name: 'OK Supermarket',
      description: 'Quality groceries at affordable prices',
      address: 'Julius Nyerere Way, Harare',
      image: 'assets/images/stores/ok-supermarket.jpg',
      categories: [ProductCategory.GROCERY],
      rating: 4.3,
      deliveryTime: '40-55 min',
      deliveryFee: 3.00,
      latitude: -17.831272,
      longitude: 31.045603,
      isOpen: true,
      openingHours: '07:00',
      closingHours: '20:00',
      tags: ['Groceries', 'Household', 'Fresh Produce'],
      featured: true,
      minimumOrder: 10,
      city: 'Harare',
      province: 'Harare'
    },
    {
      id: '3',
      name: 'Clicks Pharmacy',
      description: 'Your health is our priority',
      address: 'Borrowdale Road, Harare',
      image: 'assets/images/stores/clicks-pharmacy.jpg',
      categories: [ProductCategory.MEDICINE],
      rating: 4.7,
      deliveryTime: '30-45 min',
      deliveryFee: 2.00,
      latitude: -17.801901,
      longitude: 31.068216,
      isOpen: true,
      openingHours: '08:00',
      closingHours: '18:00',
      tags: ['Pharmacy', 'Health', 'Medicines'],
      city: 'Harare',
      province: 'Harare'
    },
    {
      id: '4',
      name: 'Pizza Inn',
      description: 'Delicious pizzas made with fresh ingredients',
      address: 'Samora Machel Avenue, Harare',
      image: 'assets/images/stores/pizza-inn.jpg',
      categories: [ProductCategory.FOOD],
      rating: 4.2,
      deliveryTime: '30-40 min',
      deliveryFee: 2.50,
      latitude: -17.829700,
      longitude: 31.052900,
      isOpen: true,
      openingHours: '10:00',
      closingHours: '22:00',
      tags: ['Pizza', 'Fast Food', 'Italian'],
      featured: true,
      city: 'Harare',
      province: 'Harare'
    },
    {
      id: '5',
      name: 'TM Pick n Pay',
      description: 'Quality groceries and household items',
      address: 'Msasa, Harare',
      image: 'assets/images/stores/tm-pick-n-pay.jpg',
      categories: [ProductCategory.GROCERY],
      rating: 4.4,
      deliveryTime: '45-60 min',
      deliveryFee: 3.50,
      latitude: -17.845900,
      longitude: 31.128300,
      isOpen: true,
      openingHours: '07:00',
      closingHours: '21:00',
      tags: ['Groceries', 'Household', 'Fresh Produce'],
      minimumOrder: 15,
      city: 'Harare',
      province: 'Harare'
    },
    {
      id: '6',
      name: 'Pedzai Pharmacy',
      description: 'Your neighborhood pharmacy for all medical needs',
      address: 'Bulawayo Road, Bulawayo',
      image: 'assets/images/stores/pedzai-pharmacy.jpg',
      categories: [ProductCategory.MEDICINE],
      rating: 4.6,
      deliveryTime: '20-35 min',
      deliveryFee: 2.00,
      latitude: -20.149542,
      longitude: 28.585484,
      isOpen: true,
      openingHours: '08:00',
      closingHours: '19:00',
      tags: ['Pharmacy', 'Health', 'Medicines'],
      city: 'Bulawayo',
      province: 'Bulawayo'
    }
  ];

  private featuredStoresSubject = new BehaviorSubject<Store[]>([]);
  public featuredStores$ = this.featuredStoresSubject.asObservable();

  constructor() {
    // Initialize with featured stores
    this.featuredStoresSubject.next(this.mockStores.filter(store => store.featured));
  }

  getAllStores(): Observable<Store[]> {
    return of(this.mockStores).pipe(delay(500)); // Simulate network delay
  }

  getStoreById(id: string): Observable<Store | undefined> {
    const store = this.mockStores.find(s => s.id === id);
    return of(store).pipe(delay(300)); // Simulate network delay
  }

  getStoresByCategory(category: ProductCategory): Observable<Store[]> {
    const stores = this.mockStores.filter(store => 
      store.categories.includes(category)
    );
    return of(stores).pipe(delay(500)); // Simulate network delay
  }

  searchStores(query: string): Observable<Store[]> {
    const normalizedQuery = query.toLowerCase().trim();
    const stores = this.mockStores.filter(store => 
      store.name.toLowerCase().includes(normalizedQuery) ||
      store.description.toLowerCase().includes(normalizedQuery) ||
      store.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    );
    return of(stores).pipe(delay(500)); // Simulate network delay
  }

  getFeaturedStores(): Observable<Store[]> {
    return this.featuredStores$;
  }

  getStoresByLocation(city: string, province?: string): Observable<Store[]> {
    let stores = this.mockStores.filter(store => store.city.toLowerCase() === city.toLowerCase());
    
    if (province) {
      stores = stores.filter(store => store.province.toLowerCase() === province.toLowerCase());
    }
    
    return of(stores).pipe(delay(500)); // Simulate network delay
  }
}
