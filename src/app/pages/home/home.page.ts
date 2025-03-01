import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';
import { 
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
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonRefresher, 
    IonRefresherContent, 
    IonButton, 
    IonIcon, 
    IonLabel, 
    IonBadge,
    NgIf, 
    NgForOf, 
    DatePipe,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, AfterViewInit {
  currentCity: string | null = null;
  featuredStores: Store[] = [];
  recentOrders: Order[] = [];
  isLoggedIn = false;

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
      title: 'Special Chicken Inn Deals',
      description: 'Get amazing deals on our famous chicken meals',
      image: 'assets/images/banners/chicken inn banner.jfif'
    },
    {
      title: 'Fresh Groceries Delivered',
      description: 'Quality products from OK Zimbabwe',
      image: 'assets/images/banners/grocery.jfif'
    },
    {
      title: 'Pizza & Snacks',
      description: 'Delicious pizzas and snacks delivered to you',
      image: 'assets/images/banners/pizza veg.jpg'
    }
  ];

  categories = [
    { name: 'Food', icon: 'fastFoodOutline', value: ProductCategory.FOOD, image: 'assets/images/categories/food.jpg' },
    { name: 'Grocery', icon: 'basketOutline', value: ProductCategory.GROCERY, image: 'assets/images/categories/grocery.jpg' },
    { name: 'Pharmacy', icon: 'medkitOutline', value: ProductCategory.MEDICINE, image: 'assets/images/categories/pharmacy.jpg' },
    { name: 'Desserts', icon: 'iceCreamOutline', value: ProductCategory.DESSERTS, image: 'assets/images/categories/desserts.jpg' },
    { name: 'Healthy', icon: 'leafOutline', value: ProductCategory.HEALTHY, image: 'assets/images/categories/healthy.jpg' },
    { name: 'Drinks', icon: 'wineOutline', value: ProductCategory.DRINKS, image: 'assets/images/categories/drinks.jpg' },
    { name: 'Snacks', icon: 'pizzaOutline', value: ProductCategory.SNACKS, image: 'assets/images/categories/snacks.jpg' },
    { name: 'Ethnic', icon: 'earthOutline', value: ProductCategory.ETHNIC, image: 'assets/images/categories/ethnic.jpg' }
  ];

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

  async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }

  navigateToCategory(category: ProductCategory) {
    this.router.navigate(['/stores'], {
      queryParams: { category }
    });
  }

  viewAllStores() {
    this.router.navigate(['/tabs/stores']);
  }

  openStore(store: Store) {
    this.router.navigate(['/tabs/stores', store.id]);
  }

  viewOrderDetails(order: Order) {
    this.router.navigate(['/tabs/orders', order.id]);
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
    return order.items
      .map(item => `${item.quantity}x ${item.product.name}`)
      .join(', ');
  }

  async reorderItems(order: Order) {
    const loading = await this.loadingController.create({
      message: 'Adding items to cart...'
    });
    await loading.present();

    try {
      const items = await this.orderService.reorder(order.id!).toPromise();
      if (items && items.length > 0) {
        await this.cartService.clearCart();
        for (const item of items) {
          await this.cartService.addToCart(item.product, item.quantity, item.store);
        }
        const toast = await this.toastController.create({
          message: 'Items added to cart',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/tabs/cart']);
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to reorder items',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }
}
