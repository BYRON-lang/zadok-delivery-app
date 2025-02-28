import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent, 
  IonButton, 
  IonIcon, 
  IonLabel, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonBadge,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  chevronDownOutline, 
  starOutline, 
  star, 
  bicycleOutline, 
  chevronForwardOutline, 
  storefrontOutline,
  fastFoodOutline,
  basketOutline,
  medkitOutline,
  cartOutline,
  iceCreamOutline,
  leafOutline,
  wineOutline,
  pizzaOutline,
  earthOutline
} from 'ionicons/icons';
import { StoreService } from '../../services/store.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { LocationService } from '../../services/location.service';
import { Store } from '../../models/store.model';
import { Order, OrderStatus } from '../../models/order.model';
import { ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonRefresher, 
    IonRefresherContent, 
    IonButton, 
    IonIcon, 
    IonLabel, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonBadge,
    NgIf, 
    NgForOf, 
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, AfterViewInit {
  ngAfterViewInit() {
    register();
  }
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    loop: true,
    slidesPerView: 1.2,
    spaceBetween: 16,
    direction: 'horizontal',
    centeredSlides: true,
    pagination: true,
    effect: 'slide',
    grabCursor: true,
    breakpoints: {
      640: {
        slidesPerView: 2.2
      },
      768: {
        slidesPerView: 2.5
      }
    }
  };

  promotionBanners = [
    {
      title: 'Free Delivery on First Order',
      description: 'Use code WELCOME at checkout',
      image: 'assets/images/banners/banner1.jpg'
    },
    {
      title: '20% Off Groceries',
      description: 'Valid until March 31st',
      image: 'assets/images/banners/banner2.jpg'
    },
    {
      title: 'Fast Medicine Delivery',
      description: 'Get your medicines in under 1 hour',
      image: 'assets/images/banners/banner3.jpg'
    }
  ];

  categories = [
    { name: 'Food', icon: 'fastFoodOutline', value: ProductCategory.FOOD },
    { name: 'Grocery', icon: 'basketOutline', value: ProductCategory.GROCERY },
    { name: 'Pharmacy', icon: 'medkitOutline', value: ProductCategory.MEDICINE },
    { name: 'Desserts', icon: 'iceCreamOutline', value: ProductCategory.DESSERTS },
    { name: 'Healthy', icon: 'leafOutline', value: ProductCategory.HEALTHY },
    { name: 'Drinks', icon: 'wineOutline', value: ProductCategory.DRINKS },
    { name: 'Snacks', icon: 'pizzaOutline', value: ProductCategory.SNACKS },
    { name: 'Ethnic', icon: 'earthOutline', value: ProductCategory.ETHNIC }
  ];

  featuredStores: Store[] = [];
  recentOrders: Order[] = [];
  isLoggedIn = false;
  currentCity: string | null = null;

  constructor(
    private storeService: StoreService,
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private locationService: LocationService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({ 
      locationOutline, 
      chevronDownOutline, 
      starOutline, 
      star, 
      bicycleOutline, 
      chevronForwardOutline, 
      storefrontOutline,
      fastFoodOutline,
      basketOutline,
      medkitOutline,
      cartOutline,
      iceCreamOutline,
      leafOutline,
      wineOutline,
      pizzaOutline,
      earthOutline
    });
  }

  async ngOnInit() {
    await this.checkAuthStatus();
    this.loadFeaturedStores();
    this.loadRecentOrders();
    this.getCurrentCity();
  }

  async handleRefresh(event: any) {
    await this.loadFeaturedStores();
    await this.loadRecentOrders();
    event.target.complete();
  }

  async checkAuthStatus() {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  async loadFeaturedStores() {
    const loading = await this.loadingController.create({
      message: 'Loading stores...',
      duration: 2000
    });
    await loading.present();

    this.storeService.getFeaturedStores().subscribe(
      (stores) => {
        this.featuredStores = stores;
        loading.dismiss();
      },
      (error) => {
        console.error('Error loading featured stores', error);
        loading.dismiss();
        this.showErrorToast('Failed to load stores');
      }
    );
  }

  async loadRecentOrders() {
    if (!this.isLoggedIn) {
      this.recentOrders = [];
      return;
    }

    this.orderService.getOrders().subscribe(
      (orders) => {
        // Get the 2 most recent orders
        this.recentOrders = orders.slice(0, 2);
      },
      (error) => {
        console.error('Error loading recent orders', error);
        this.showErrorToast('Failed to load recent orders');
      }
    );
  }

  async getCurrentCity() {
    try {
      const position = await this.locationService.getCurrentPosition();
      // In a real app, we would use reverse geocoding to get the city name
      // For now, we'll default to Harare
      this.currentCity = 'Harare';
    } catch (error) {
      console.error('Error getting current location', error);
      this.currentCity = null;
    }
  }

  async openLocationSelector() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select City',
      buttons: [
        {
          text: 'Harare',
          handler: () => {
            this.currentCity = 'Harare';
            this.loadFeaturedStores();
          }
        },
        {
          text: 'Bulawayo',
          handler: () => {
            this.currentCity = 'Bulawayo';
            this.loadFeaturedStores();
          }
        },
        {
          text: 'Mutare',
          handler: () => {
            this.currentCity = 'Mutare';
            this.loadFeaturedStores();
          }
        },
        {
          text: 'Gweru',
          handler: () => {
            this.currentCity = 'Gweru';
            this.loadFeaturedStores();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  navigateToCategory(category: ProductCategory) {
    this.router.navigate(['/tabs/search'], { 
      queryParams: { category } 
    });
  }

  viewAllStores() {
    this.router.navigate(['/tabs/search']);
  }

  openStore(store: Store) {
    this.router.navigate(['/store', store.id]);
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

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
