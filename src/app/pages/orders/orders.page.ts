import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonList,
  IonThumbnail,
  IonBadge,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSkeletonText,
  IonItemGroup,
  IonItemOptions,
  IonItemOption,
  IonText,
  ToastController,
  LoadingController,
  AlertController
} from '@ionic/angular/standalone';
import { NgIf, NgFor, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  receiptOutline,
  timeOutline,
  bicycleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  restaurantOutline,
  cartOutline,
  callOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonList,
    IonThumbnail,
    IonBadge,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonSkeletonText,
    IonItemGroup,
    IonItemOptions,
    IonItemOption,
    IonText,
    NgIf,
    NgFor,
    DatePipe,
    NgClass,
    FormsModule
  ]
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  isLoading: boolean = true;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({
      receiptOutline,
      timeOutline,
      bicycleOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      restaurantOutline,
      cartOutline,
      callOutline,
      chevronForwardOutline
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;

    try {
      // Check if user is authenticated
      const isAuthenticated = await this.authService.isAuthenticated().toPromise();
      
      if (!isAuthenticated) {
        this.showAuthError();
        this.isLoading = false;
        return;
      }

      this.orderService.getOrders().subscribe(
        (orders) => {
          this.orders = orders;
          this.filterOrders();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading orders', error);
          this.showErrorToast('Failed to load orders');
          this.isLoading = false;
        }
      );
    } catch (error) {
      console.error('Error checking authentication', error);
      this.showAuthError();
      this.isLoading = false;
    }
  }

  filterOrders() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        order => order.status.toLowerCase() === this.selectedStatus
      );
    }
  }

  handleRefresh(event: any) {
    this.loadOrders().then(() => {
      event.target.complete();
    });
  }

  viewOrderDetails(order: Order) {
    this.router.navigate(['/order-details', order.id]);
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.CONFIRMED:
        return 'primary';
      case OrderStatus.PREPARING:
        return 'secondary';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'tertiary';
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.CANCELLED:
        return 'danger';
      default:
        return 'medium';
    }
  }

  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'time-outline';
      case OrderStatus.CONFIRMED:
        return 'receipt-outline';
      case OrderStatus.PREPARING:
        return 'restaurant-outline';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bicycle-outline';
      case OrderStatus.DELIVERED:
        return 'checkmark-circle-outline';
      case OrderStatus.CANCELLED:
        return 'close-circle-outline';
      default:
        return 'receipt-outline';
    }
  }

  getOrderSummary(order: Order): string {
    if (order.items.length === 0) return 'No items';
    
    const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
    const firstItem = order.items[0].product.name;
    
    if (order.items.length === 1) {
      return `${itemCount}x ${firstItem}`;
    } else {
      return `${itemCount}x ${firstItem} and ${order.items.length - 1} more items`;
    }
  }

  async reorderItems(order: Order) {
    const loading = await this.loadingController.create({
      message: 'Adding items to cart...',
      duration: 2000
    });
    await loading.present();

    try {
      // Clear existing cart
      await this.cartService.clearCart();
      
      // Add items to cart
      for (const item of order.items) {
        await this.cartService.addToCart(item.product, item.quantity, order.store);
      }
      
      loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Items added to cart',
        duration: 2000,
        position: 'bottom',
        buttons: [
          {
            text: 'View Cart',
            role: 'cancel',
            handler: () => {
              this.router.navigate(['/tabs/cart']);
            }
          }
        ]
      });
      
      await toast.present();
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Failed to add items to cart');
    }
  }

  async cancelOrder(order: Order) {
    const alert = await this.alertController.create({
      header: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.processCancelOrder(order);
          }
        }
      ]
    });

    await alert.present();
  }

  async processCancelOrder(order: Order) {
    const loading = await this.loadingController.create({
      message: 'Cancelling order...',
      duration: 2000
    });
    await loading.present();

    try {
      if (order.id) {
        await this.orderService.cancelOrder(order.id);
      } else {
        throw new Error('Order ID is undefined');
      }
      
      // Update the local order status
      const index = this.orders.findIndex(o => o.id === order.id);
      if (index !== -1) {
        this.orders[index].status = OrderStatus.CANCELLED;
        this.filterOrders();
      }
      
      loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Order cancelled successfully',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      
      await toast.present();
    } catch (error) {
      loading.dismiss();
      this.showErrorToast('Failed to cancel order');
    }
  }

  loadMoreOrders(event: any) {
    // In a real app, this would load more orders from the backend
    // For now, we'll just simulate it with a timeout
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
    this.showErrorToast('Please log in to view your orders');
  }
}
