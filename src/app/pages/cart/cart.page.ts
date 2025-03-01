import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CartItem } from '../../models/order.model';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/shared/header/header.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, HeaderComponent]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  savedItems: CartItem[] = [];
  subtotal: number = 0;
  deliveryFee: number = 5.00; // Default delivery fee
  serviceFee: number = 2.00; // Default service fee
  total: number = 0;
  tax: number = 0;
  promoCode: string = '';
  specialInstructions: { [key: string]: string } = {};
  promoDiscount: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  async loadCartItems() {
    this.cartItems = await firstValueFrom(this.cartService.getCartItems());
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    this.tax = this.subtotal * 0.15; // 15% VAT
    this.total = this.subtotal + this.deliveryFee + this.serviceFee + this.tax - this.promoDiscount;
  }

  async updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && item.product.id) {
      await this.cartService.updateCartItemQuantity(item.product.id, newQuantity);
      await this.loadCartItems();
    }
  }

  checkItemAvailability(item: CartItem): boolean {
    return item.product.quantity > 0;
  }

  async removeItem(item: CartItem) {
    await this.cartService.removeItem(item);
    await this.loadCartItems();
  }

  async saveForLater(item: CartItem) {
    this.savedItems.push(item);
    await this.removeItem(item);
  }

  async moveToCart(item: CartItem) {
    const index = this.savedItems.indexOf(item);
    if (index > -1) {
      this.savedItems.splice(index, 1);
      await this.cartService.addToCart(item.product, 1, item.store);
      await this.loadCartItems();
    }
  }

  groupItemsByVendor() {
    const groups = new Map<string, CartItem[]>();
    this.cartItems.forEach(item => {
      const vendorName = item.store.name;
      if (!groups.has(vendorName)) {
        groups.set(vendorName, []);
      }
      groups.get(vendorName)?.push(item);
    });
    return groups;
  }

  updateSpecialInstructions(vendorName: string, instructions: string) {
    this.specialInstructions[vendorName] = instructions;
  }

  async applyPromoCode() {
    // Simple promo code implementation
    if (this.promoCode.toLowerCase() === 'welcome10') {
      this.promoDiscount = this.subtotal * 0.1; // 10% discount
      this.calculateTotals();
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'Promo code applied successfully!',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Invalid promo code',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  proceedToCheckout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      this.alertController.create({
        header: 'Empty Cart',
        message: 'Please add items to your cart before proceeding to checkout.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  continueShopping() {
    this.router.navigate(['/tabs/tab1']);
  }
}