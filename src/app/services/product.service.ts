import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock data for products
  private mockProducts: Product[] = [
    // Chicken Inn Products
    {
      id: '1',
      name: 'Chicken Inn 2 Piece',
      description: 'Two pieces of our famous fried chicken',
      price: 5.99,
      image: 'assets/images/products/chicken-inn-2piece.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true
    },
    {
      id: '2',
      name: 'Chicken Inn Burger',
      description: 'Delicious chicken burger with lettuce, tomato, and special sauce',
      price: 4.50,
      image: 'assets/images/products/chicken-inn-burger.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true
    },
    {
      id: '3',
      name: 'Chicken Inn Family Meal',
      description: '8 pieces of chicken, 4 rolls, and large chips',
      price: 19.99,
      image: 'assets/images/products/chicken-inn-family.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true
    },
    
    // OK Supermarket Products
    {
      id: '4',
      name: 'Mazoe Orange Crush 2L',
      description: 'Refreshing orange flavored drink concentrate',
      price: 3.50,
      image: 'assets/images/products/mazoe-orange.jpg',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true
    },
    {
      id: '5',
      name: 'Mealie Meal 10kg',
      description: 'Super refined white maize meal',
      price: 8.99,
      image: 'assets/images/products/mealie-meal.jpg',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true
    },
    {
      id: '6',
      name: 'Fresh Bread Loaf',
      description: 'Freshly baked white bread',
      price: 1.20,
      image: 'assets/images/products/bread.jpg',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true
    },
    
    // Clicks Pharmacy Products
    {
      id: '7',
      name: 'Paracetamol 500mg',
      description: 'Pain relief medication, pack of 20 tablets',
      price: 2.50,
      image: 'assets/images/products/paracetamol.jpg',
      category: ProductCategory.MEDICINE,
      storeId: '3',
      available: true
    },
    {
      id: '8',
      name: 'Vitamin C Tablets',
      description: 'Immune support, pack of 30 tablets',
      price: 6.99,
      image: 'assets/images/products/vitamin-c.jpg',
      category: ProductCategory.MEDICINE,
      storeId: '3',
      available: true
    },
    {
      id: '9',
      name: 'Hand Sanitizer 250ml',
      description: 'Kills 99.9% of germs',
      price: 3.75,
      image: 'assets/images/products/sanitizer.jpg',
      category: ProductCategory.MEDICINE,
      storeId: '3',
      available: true
    },
    
    // Pizza Inn Products
    {
      id: '10',
      name: 'Margherita Pizza - Medium',
      description: 'Classic cheese and tomato pizza',
      price: 8.99,
      image: 'assets/images/products/margherita.jpg',
      category: ProductCategory.FOOD,
      storeId: '4',
      available: true
    },
    {
      id: '11',
      name: 'Pepperoni Pizza - Medium',
      description: 'Pizza topped with pepperoni slices',
      price: 10.99,
      image: 'assets/images/products/pepperoni.jpg',
      category: ProductCategory.FOOD,
      storeId: '4',
      available: true
    },
    {
      id: '12',
      name: 'Garlic Bread',
      description: 'Freshly baked bread with garlic butter',
      price: 3.50,
      image: 'assets/images/products/garlic-bread.jpg',
      category: ProductCategory.FOOD,
      storeId: '4',
      available: true
    }
  ];

  constructor() { }

  getProductsByStoreId(storeId: string): Observable<Product[]> {
    const products = this.mockProducts.filter(product => product.storeId === storeId);
    return of(products).pipe(delay(500)); // Simulate network delay
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(300)); // Simulate network delay
  }

  searchProducts(query: string, storeId?: string): Observable<Product[]> {
    const normalizedQuery = query.toLowerCase().trim();
    let products = this.mockProducts.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
    
    if (storeId) {
      products = products.filter(product => product.storeId === storeId);
    }
    
    return of(products).pipe(delay(500)); // Simulate network delay
  }

  getProductsByCategory(category: ProductCategory, storeId?: string): Observable<Product[]> {
    let products = this.mockProducts.filter(product => product.category === category);
    
    if (storeId) {
      products = products.filter(product => product.storeId === storeId);
    }
    
    return of(products).pipe(delay(500)); // Simulate network delay
  }
}
