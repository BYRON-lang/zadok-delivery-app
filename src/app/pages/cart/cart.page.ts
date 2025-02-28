import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonThumbnail,
  IonLabel,
  IonAvatar,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { NgIf, NgForOf, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  cartOutline, 
  bicycleOutline, 
  addCircleOutline, 
  removeCircleOutline, 
  trashOutline,
  addOutline
} from 'ionicons/icons';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/order.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.page.html',
  styleUrls: ['cart.page.scss'],
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
    IonItemSliding,
    IonItemOption,
    IonItemOptions,
    IonThumbnail,
    IonLabel,
    IonAvatar,
    IonInput,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    NgIf,
    NgForOf,
    SlicePipe,
    FormsModule
  ]
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  store: Store | null = null;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({
      cartOutline,
      bicycleOutline,
      addCircleOutline,
      removeCircleOutline,
      trashOutline,
      addOutline
    });
  }

  ngOnInit() {
    this.loadCart();
  }

  private async loadCart() {
    this.cartItems = await this.cartService.getCartItems();
    if (this.cartItems.length > 0) {
      this.store = await this.cartService.getStore();
    }
    this.calculateTotals();
  }

  async decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      await this.cartService.updateItemQuantity(item);
      this.calculateTotals();
    }
  }

  async increaseQuantity(item: CartItem) {
    item.quantity++;
    await this.cartService.updateItemQuantity(item);
    this.calculateTotals();
  }

  async removeItem(item: CartItem) {
    const alert = await this.alertController.create({
      header: 'Remove Item',
      message: 'Are you sure you want to remove this item from your cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          handler: async () => {
            await this.cartService.removeItem(item);
            this.cartItems = this.cartItems.filter(i => i !== item);
            this.calculateTotals();
            if (this.cartItems.length === 0) {
              this.store = null;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  addMoreItems() {
    this.router.navigate(['/tabs/home']);
  }

  subtotal = 0;
  serviceFee = 0;
  total = 0;
  promoCode = '';

  private calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.serviceFee = this.subtotal * 0.05; // 5% service fee
    const deliveryFee = this.store?.deliveryFee || 0;
    this.total = this.subtotal + this.serviceFee + deliveryFee;
  }

  async applyPromoCode() {
    if (!this.promoCode) {
      const toast = await this.toastController.create({
        message: 'Please enter a promo code',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // TODO: Implement promo code validation and application
    const toast = await this.toastController.create({
      message: 'Invalid promo code',
      duration: 2000,
      color: 'danger'
    });
    await toast.present();
  }
}
