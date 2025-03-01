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
      name: 'Chicken Bucket and Chips',
      description: 'Large bucket of our famous fried chicken with crispy chips',
      price: 15.99,
      image: 'assets/images/banners/chicken bucket and chips.jfif',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 50
    },
    {
      id: '2',
      name: 'Chicken and Chips Large',
      description: 'Large portion of fried chicken with a generous serving of chips',
      price: 12.99,
      image: 'assets/images/banners/chicken and chips large.jfif',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 75
    },
    {
      id: '3',
      name: 'Chicken Bucket',
      description: 'Family size bucket of our signature fried chicken',
      price: 19.99,
      image: 'assets/images/banners/chicken bucket.jfif',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 40
    },
    {
      id: '4',
      name: 'Chocolate Milkshake',
      description: 'Rich and creamy chocolate milkshake',
      price: 3.99,
      image: 'assets/images/banners/chocolate milkshake.jfif',
      category: ProductCategory.DRINKS,
      storeId: '1',
      available: true,
      quantity: 100
    },
    {
      id: '5',
      name: 'Coca-Cola 2L',
      description: 'Refreshing Coca-Cola in 2 liter bottle',
      price: 2.99,
      image: 'assets/images/banners/coke 2 litres.jfif',
      category: ProductCategory.DRINKS,
      storeId: '1',
      available: true,
      quantity: 200
    },
    {
      id: '6',
      name: 'Coca-Cola 1L',
      description: 'Refreshing Coca-Cola in 1 liter bottle',
      price: 1.99,
      image: 'assets/images/banners/coke 1 litres.jfif',
      category: ProductCategory.DRINKS,
      storeId: '1',
      available: true,
      quantity: 200
    },
    // Pizza Inn Products
    {
      id: '7',
      name: 'Vegetarian Pizza Small',
      description: 'Fresh vegetarian pizza with assorted toppings',
      price: 8.99,
      image: 'assets/images/banners/pizza small veg.jfif',
      category: ProductCategory.FOOD,
      storeId: '4',
      available: true,
      quantity: 30
    },
    {
      id: '8',
      name: 'Sausage Pizza',
      description: 'Delicious pizza topped with premium sausage',
      price: 11.99,
      image: 'assets/images/banners/sausage pizza.jfif',
      category: ProductCategory.FOOD,
      storeId: '4',
      available: true,
      quantity: 25
    },
    // Desserts and Snacks
    {
      id: '9',
      name: 'Chocolate Ice Cream',
      description: 'Rich and creamy chocolate ice cream',
      price: 4.99,
      image: 'assets/images/banners/chocolate ice cream.jpg',
      category: ProductCategory.DESSERTS,
      storeId: '5',
      available: true,
      quantity: 50
    },
    {
      id: '10',
      name: 'Cupcake',
      description: 'Freshly baked cupcake with frosting',
      price: 2.49,
      image: 'assets/images/banners/cupcake.jpg',
      category: ProductCategory.DESSERTS,
      storeId: '5',
      available: true,
      quantity: 100
    },
    {
      id: '11',
      name: 'Cake',
      description: 'Delicious whole cake perfect for celebrations',
      price: 24.99,
      image: 'assets/images/banners/cake.jpg',
      category: ProductCategory.DESSERTS,
      storeId: '5',
      available: true,
      quantity: 15
    },
    {
      id: '12',
      name: 'Cornflakes',
      description: 'Crunchy breakfast cereal',
      price: 5.99,
      image: 'assets/images/banners/cornflakes.jfif',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true,
      quantity: 150
    },
    // Chicken Inn Products
    {
      id: '1',
      name: 'Chicken Inn 2 Piece',
      description: 'Two pieces of our famous fried chicken',
      price: 5.99,
      image: 'assets/images/products/chicken-inn-2piece.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 100
    },
    {
      id: '2',
      name: 'Chicken Inn Burger',
      description: 'Delicious chicken burger with lettuce, tomato, and special sauce',
      price: 4.50,
      image: 'assets/images/products/chicken-inn-burger.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 100
    },
    {
      id: '3',
      name: 'Chicken Inn Family Meal',
      description: '8 pieces of chicken, 4 rolls, and large chips',
      price: 19.99,
      image: 'assets/images/products/chicken-inn-family.jpg',
      category: ProductCategory.FOOD,
      storeId: '1',
      available: true,
      quantity: 50
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
      available: true,
      quantity: 200
    },
    {
      id: '5',
      name: 'Mealie Meal 10kg',
      description: 'Super refined white maize meal',
      price: 8.99,
      image: 'assets/images/products/mealie-meal.jpg',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true,
      quantity: 150
    },
    {
      id: '6',
      name: 'Fresh Bread Loaf',
      description: 'Freshly baked white bread',
      price: 1.20,
      image: 'assets/images/products/bread.jpg',
      category: ProductCategory.GROCERY,
      storeId: '2',
      available: true,
      quantity: 300
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
      available: true,
      quantity: 500
    },
    {
      id: '8',
      name: 'Vitamin C Tablets',
      description: 'Immune support, pack of 30 tablets',
      price: 6.99,
      image: 'assets/images/products/vitamin-c.jpg',
      category: ProductCategory.MEDICINE,
      storeId: '3',
      available: true,
      quantity: 400
    },
    {
      id: '9',
      name: 'Hand Sanitizer 250ml',
      description: 'Kills 99.9% of germs',
      price: 3.99,
      image: 'assets/images/products/sanitizer.jpg',
      category: ProductCategory.MEDICINE,
      storeId: '3',
      available: true,
      quantity: 250
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(500));
  }

  getProductsByStore(storeId: string): Observable<Product[]> {
    const storeProducts = this.mockProducts.filter(product => product.storeId === storeId);
    return of(storeProducts).pipe(delay(500));
  }

  getProductById(productId: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === productId);
    return of(product).pipe(delay(500));
  }

  searchProducts(query: string): Observable<Product[]> {
    const searchResults = this.mockProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(searchResults).pipe(delay(500));
  }

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    const categoryProducts = this.mockProducts.filter(product => product.category === category);
    return of(categoryProducts).pipe(delay(500));
  }
}
