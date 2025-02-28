import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonRadio,
  IonRadioGroup,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonBackButton,
  IonButtons,
  ToastController,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { NgIf, NgForOf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  cardOutline,
  locationOutline,
  timeOutline,
  callOutline,
  chevronBackOutline,
  homeOutline,
  navigateOutline
} from 'ionicons/icons';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/order.model';
import { Store } from '../../models/store.model';
import { Order, OrderStatus, PaymentMethod } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.page.html',
  styleUrls: ['checkout.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonRadio,
    IonRadioGroup,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonBackButton,
    IonButtons,
    NgIf,
    NgForOf,
    CurrencyPipe,
    FormsModule
  ]
})
export class CheckoutPage implements OnInit {
  cartItems: CartItem[] = [];
  store: Store | null = null;
  subtotal = 0;
  serviceFee = 0;
  total = 0;
  promoDiscount = 0;
  
  // Delivery details
  deliveryAddress = '';
  deliveryInstructions = '';
  contactPhone = '';
  
  // Payment method
  paymentMethod: PaymentMethod = PaymentMethod.CASH; // Default to cash on delivery

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({
      cashOutline,
      cardOutline,
      locationOutline,
      timeOutline,
      callOutline,
      chevronBackOutline,
      homeOutline,
      navigateOutline
    });
  }

  async ngOnInit() {
    await this.loadCartData();
    await this.loadUserData();
  }

  async loadCartData() {
    this.cartItems = await firstValueFrom(this.cartService.cartItems$);
    this.store = await firstValueFrom(this.cartService.currentStore$);
    this.calculateTotals();
    
    if (this.cartItems.length === 0) {
      this.showErrorToast('Your cart is empty');
      this.router.navigate(['/tabs/cart']);
    }
  }

  async loadUserData() {
    try {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.deliveryAddress = user.addresses?.[0]?.fullAddress || '';
          this.contactPhone = user.phone || '';
        }
      });
    } catch (error) {
      console.error('Error loading user data', error);
    }
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    );
    
    // Calculate service fee (5% of subtotal)
    this.serviceFee = this.subtotal * 0.05;
    
    // Calculate total
    this.total = this.subtotal + (this.store?.deliveryFee || 0) + this.serviceFee - this.promoDiscount;
  }

  async placeOrder() {
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Placing your order...'
    });
    await loading.present();

    try {
      // Check if user is authenticated
      const isAuthenticated = await firstValueFrom(this.authService.isAuthenticated());
      
      if (!isAuthenticated) {
        loading.dismiss();
        this.showAuthError();
        return;
      }

      if (!this.store) {
        throw new Error('No store selected');
      }

      // Validate contact phone
      if (!this.contactPhone || this.contactPhone.trim() === '') {
        throw new Error('Contact phone is required');
      }

      // Submit order
      const order = await firstValueFrom(this.orderService.placeOrder(
        this.cartItems,
        this.store,
        this.deliveryAddress,
        this.contactPhone.trim(),
        this.paymentMethod,
        this.deliveryInstructions
      ));
      
      if (!order.id) {
        throw new Error('Order ID is undefined');
      }
      
      // Clear cart after successful order
      await this.cartService.clearCart();
      
      loading.dismiss();
      
      // Show success message and navigate to order confirmation
      await this.showOrderConfirmation(order.id);
    } catch (error) {
      loading.dismiss();
      console.error('Error placing order', error);
      this.showErrorToast('Failed to place order. Please try again.');
    }
  }

  validateForm(): boolean {
    if (!this.deliveryAddress || this.deliveryAddress.trim() === '') {
      this.showErrorToast('Please enter your delivery address');
      return false;
    }

    if (!this.contactPhone || this.contactPhone.trim() === '') {
      this.showErrorToast('Please enter your contact phone number');
      return false;
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(this.contactPhone.trim())) {
      this.showErrorToast('Please enter a valid phone number');
      return false;
    }

    return true;
  }

  async showOrderConfirmation(orderId: string) {
    const alert = await this.alertController.create({
      header: 'Order Placed Successfully!',
      message: `Your order has been placed. Order ID: ${orderId}`,
      buttons: [
        {
          text: 'View Order',
          handler: () => {
            this.router.navigate(['/order-details', orderId]);
          }
        },
        {
          text: 'Back to Home',
          handler: () => {
            this.router.navigate(['/tabs/home']);
          }
        }
      ]
    });

    await alert.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  private showAuthError() {
    this.showErrorToast('Please log in to place an order');
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
  }
}