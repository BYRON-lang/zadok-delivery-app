import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem } from '../models/order.model';
import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { Cart } from '../models/cart.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private currentStoreSubject = new BehaviorSubject<Store | null>(null);
  public currentStore$ = this.currentStoreSubject.asObservable();
  
  private readonly CART_STORAGE_KEY = 'cart_items';
  private readonly STORE_STORAGE_KEY = 'current_store';

  constructor() {
    this.loadCart();
  }

  private async loadCart() {
    try {
      const { value: cartData } = await Preferences.get({ key: this.CART_STORAGE_KEY });
      const { value: storeData } = await Preferences.get({ key: this.STORE_STORAGE_KEY });
      
      if (cartData) {
        const cartItems = JSON.parse(cartData);
        this.cartItemsSubject.next(cartItems);
      }
      
      if (storeData) {
        const store = JSON.parse(storeData);
        this.currentStoreSubject.next(store);
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  }

  private async saveCart() {
    try {
      const cartItems = this.cartItemsSubject.value;
      const store = this.currentStoreSubject.value;
      
      await Preferences.set({
        key: this.CART_STORAGE_KEY,
        value: JSON.stringify(cartItems)
      });
      
      if (store) {
        await Preferences.set({
          key: this.STORE_STORAGE_KEY,
          value: JSON.stringify(store)
        });
      }
    } catch (error) {
      console.error('Failed to save cart to storage', error);
    }
  }

  async addToCart(product: Product, quantity: number, store: Store) {
    const currentStore = this.currentStoreSubject.value;
    const currentCart = this.cartItemsSubject.value;
    
    // Check if adding from a different store
    if (currentStore && currentStore.id !== store.id && currentCart.length > 0) {
      // Cannot add from different store if cart already has items
      throw new Error('Cannot add items from different stores. Please clear your cart first.');
    }
    
    // Set current store if not set
    if (!currentStore) {
      this.currentStoreSubject.next(store);
    }
    
    // Check if product already in cart
    const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product already in cart
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedCart);
    } else {
      // Add new item to cart
      const newItem: CartItem = { product, quantity, store };
      this.cartItemsSubject.next([...currentCart, newItem]);
    }
    
    await this.saveCart();
  }

  async updateCartItemQuantity(productId: string, quantity: number) {
    const currentCart = this.cartItemsSubject.value;
    const itemIndex = currentCart.findIndex(item => item.product.id === productId);
    
    if (itemIndex === -1) {
      return;
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await this.removeFromCart(productId);
    } else {
      // Update quantity
      const updatedCart = [...currentCart];
      updatedCart[itemIndex].quantity = quantity;
      this.cartItemsSubject.next(updatedCart);
      await this.saveCart();
    }
  }

  async removeFromCart(productId: string) {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(updatedCart);
    
    // If cart is empty, clear current store
    if (updatedCart.length === 0) {
      this.currentStoreSubject.next(null);
      await Preferences.remove({ key: this.STORE_STORAGE_KEY });
    }
    
    await this.saveCart();
  }

  async clearCart() {
    this.cartItemsSubject.next([]);
    this.currentStoreSubject.next(null);
    await Preferences.remove({ key: this.CART_STORAGE_KEY });
    await Preferences.remove({ key: this.STORE_STORAGE_KEY });
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$;
  }

  getCurrentStore(): Observable<Store | null> {
    return this.currentStore$;
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  async getCartStore(): Promise<Store | null> {
    return this.currentStoreSubject.value;
  }

  // Add method to remove a cart item by reference
  async removeItem(item: CartItem) {
    if (item.product.id) {
      await this.removeFromCart(item.product.id);
    } else {
      // If for some reason the product doesn't have an ID, remove by reference
      const currentCart = this.cartItemsSubject.value;
      const updatedCart = currentCart.filter(i => i !== item);
      this.cartItemsSubject.next(updatedCart);
      
      // If cart is empty, clear current store
      if (updatedCart.length === 0) {
        this.currentStoreSubject.next(null);
        await Preferences.remove({ key: this.STORE_STORAGE_KEY });
      }
      
      await this.saveCart();
    }
  }
}
