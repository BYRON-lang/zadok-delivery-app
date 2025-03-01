import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonSearchbar, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel, 
  IonList, 
  IonItem, 
  IonItemDivider, 
  IonItemGroup, 
  IonThumbnail, 
  IonIcon, 
  IonBadge, 
  IonSpinner, 
  IonInfiniteScroll, 
  IonInfiniteScrollContent,
  ActionSheetController,
  AlertController,
  ToastController,
  IonButtons,
  IonButton,
  IonText
} from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { 
  optionsOutline, 
  swapVerticalOutline, 
  searchOutline, 
  star, 
  closeCircleOutline,
  home,
  personCircleOutline,
  storefrontOutline
} from 'ionicons/icons';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { Store } from '../../models/store.model';
import { Product, ProductCategory } from '../../models/product.model';
import { FilterOptions } from '../../models/filter.model';

enum SortOption {
  RATING = 'rating',
  DELIVERY_TIME = 'delivery_time',
  DELIVERY_FEE = 'delivery_fee',
  DISTANCE = 'distance'
}

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    IonContent,
    IonToolbar,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonItemDivider,
    IonItemGroup,
    IonThumbnail, 
    IonIcon, 
    IonBadge, 
    IonSpinner, 
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
    IonButtons,
    IonButton,
    IonText,
    NgIf, 
    NgFor,
    FormsModule
  ]
})
export class SearchPage implements OnInit {
  searchQuery = '';
  selectedSegment = 'all';
  stores: Store[] = [];
  filteredStores: Store[] = [];
  hasMoreStores = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  hasMoreProducts = false;
  activeFilters = 0;
  
  // Filter options
  filterOptions: FilterOptions = {
    available: false,
    minPrice: 0,
    maxPrice: 0,
    openNow: false,
    minRating: 0,
    maxDeliveryFee: 0,
    maxDeliveryTime: 0
  };
  
  // Sort option
  sortBy: SortOption = SortOption.RATING;

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ 
      optionsOutline, 
      swapVerticalOutline, 
      searchOutline, 
      star, 
      closeCircleOutline,
      home,
      personCircleOutline,
      storefrontOutline
    });
  }

  ngOnInit() {
    // Check if we have a category from route params
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedSegment = params['category'];
      }
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading = true;
    
    if (this.selectedSegment === 'all') {
      // Get all products from all stores
      this.productService.searchProducts('').subscribe(
        (products) => {
          this.products = products;
          this.applyFilters();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading products', error);
          this.isLoading = false;
          this.showErrorToast('Failed to load products');
        }
      );
    } else {
      const category = this.selectedSegment as ProductCategory;
      this.productService.getProductsByCategory(category).subscribe(
        (products) => {
          this.products = products;
          this.applyFilters();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading products by category', error);
          this.isLoading = false;
          this.showErrorToast('Failed to load products');
        }
      );
    }
  }

  onSearchChange(event: any) {
    if (this.searchQuery.trim() === '') {
      this.applyFilters();
      return;
    }
    
    this.isLoading = true;
    this.productService.searchProducts(this.searchQuery).subscribe(
      (products) => {
        this.products = products;
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error searching products', error);
        this.isLoading = false;
        this.showErrorToast('Failed to search products');
      }
    );
  }

  segmentChanged() {
    this.loadProducts();
  }
  
  getStoreName(storeId: string): string {
    // Fix: Use a local variable to store the result and handle the Observable properly
    let storeName = 'Unknown Store';
    this.storeService.getStoreById(storeId).subscribe(store => {
      if (store) {
        storeName = store.name;
      }
    });
    return storeName;
  }
  
  openProduct(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  applyFilters() {
    let filtered = [...this.stores];
    
    // Apply search filter
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(query) || 
        store.description.toLowerCase().includes(query) ||
        store.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply segment filter
    if (this.selectedSegment !== 'all') {
      const category = this.selectedSegment as ProductCategory;
      filtered = filtered.filter(store => 
        store.categories.includes(category)
      );
    }
    
    // Apply additional filters
    if (this.filterOptions.openNow) {
      filtered = filtered.filter(store => store.isOpen);
    }
    
    if (this.filterOptions.minRating > 0) {
      filtered = filtered.filter(store => store.rating >= this.filterOptions.minRating);
    }
    
    if (this.filterOptions.maxDeliveryFee > 0) {
      filtered = filtered.filter(store => store.deliveryFee <= this.filterOptions.maxDeliveryFee);
    }
    
    if (this.filterOptions.maxDeliveryTime > 0) {
      // Convert delivery time string to minutes for comparison
      filtered = filtered.filter(store => {
        const timeRange = store.deliveryTime.split('-');
        const maxTime = parseInt(timeRange[1] || timeRange[0], 10);
        return maxTime <= this.filterOptions.maxDeliveryTime;
      });
    }
    
    // Apply sorting
    this.sortStores(filtered);
    
    this.filteredStores = filtered;
    this.stores = this.filteredStores.slice(0, 10); // Initial load
    this.hasMoreStores = this.filteredStores.length > this.stores.length;
    
    // Count active filters
    this.activeFilters = 0;
    if (this.filterOptions.openNow) this.activeFilters++;
    if (this.filterOptions.minRating > 0) this.activeFilters++;
    if (this.filterOptions.maxDeliveryFee > 0) this.activeFilters++;
    if (this.filterOptions.maxDeliveryTime > 0) this.activeFilters++;
  }

  sortStores(stores: Store[]) {
    switch (this.sortBy) {
      case SortOption.RATING:
        stores.sort((a, b) => b.rating - a.rating);
        break;
      case SortOption.DELIVERY_TIME:
        // Sort by the minimum delivery time
        stores.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.split('-')[0], 10);
          const bTime = parseInt(b.deliveryTime.split('-')[0], 10);
          return aTime - bTime;
        });
        break;
      case SortOption.DELIVERY_FEE:
        stores.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case SortOption.DISTANCE:
        // In a real app, we would calculate distance from user's location
        // For now, we'll just use a random value
        stores.sort((a, b) => Math.random() - 0.5);
        break;
    }
  }

  loadMoreStores(event: any) {
    // Simulate loading more stores
    setTimeout(() => {
      const currentLength = this.stores.length;
      const newStores = this.filteredStores.slice(currentLength, currentLength + 10);
      this.stores = [...this.stores, ...newStores];
      
      event.target.complete();
      
      // Check if we have more stores to load
      this.hasMoreStores = this.stores.length < this.filteredStores.length;
    }, 500);
  }

  async openFilterOptions() {
    const alert = await this.alertController.create({
      header: 'Filter Options',
      inputs: [
        {
          name: 'openNow',
          type: 'checkbox',
          label: 'Open Now',
          value: 'openNow',
          checked: this.filterOptions.openNow
        },
        {
          name: 'minRating',
          type: 'number',
          placeholder: 'Minimum Rating (1-5)',
          min: 0,
          max: 5,
          value: this.filterOptions.minRating
        },
        {
          name: 'maxDeliveryFee',
          type: 'number',
          placeholder: 'Maximum Delivery Fee ($)',
          min: 0,
          value: this.filterOptions.maxDeliveryFee
        },
        {
          name: 'maxDeliveryTime',
          type: 'number',
          placeholder: 'Maximum Delivery Time (minutes)',
          min: 0,
          value: this.filterOptions.maxDeliveryTime
        }
      ],
      buttons: [
        {
          text: 'Reset',
          role: 'destructive',
          handler: () => {
            this.filterOptions = {
              available: false,
              minPrice: 0,
              maxPrice: 0,
              openNow: false,
              minRating: 0,
              maxDeliveryFee: 0,
              maxDeliveryTime: 0
            };
            this.applyFilters();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Apply',
          handler: (data) => {
            this.filterOptions.openNow = data.includes('openNow');
            this.filterOptions.minRating = parseFloat(data.minRating) || 0;
            this.filterOptions.maxDeliveryFee = parseFloat(data.maxDeliveryFee) || 0;
            this.filterOptions.maxDeliveryTime = parseFloat(data.maxDeliveryTime) || 0;
            this.applyFilters();
          }
        }
      ]
    });

    await alert.present();
  }

  async openSortOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sort By',
      buttons: [
        {
          text: 'Rating (Highest First)',
          handler: () => {
            this.sortBy = SortOption.RATING;
            this.applyFilters();
          }
        },
        {
          text: 'Delivery Time (Fastest First)',
          handler: () => {
            this.sortBy = SortOption.DELIVERY_TIME;
            this.applyFilters();
          }
        },
        {
          text: 'Delivery Fee (Lowest First)',
          handler: () => {
            this.sortBy = SortOption.DELIVERY_FEE;
            this.applyFilters();
          }
        },
        {
          text: 'Distance (Nearest First)',
          handler: () => {
            this.sortBy = SortOption.DISTANCE;
            this.applyFilters();
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

  getSortLabel(): string {
    switch (this.sortBy) {
      case SortOption.RATING:
        return 'Rating';
      case SortOption.DELIVERY_TIME:
        return 'Delivery Time';
      case SortOption.DELIVERY_FEE:
        return 'Delivery Fee';
      case SortOption.DISTANCE:
        return 'Distance';
      default:
        return 'Rating';
    }
  }

  openStore(store: Store) {
    this.router.navigate(['/store', store.id]);
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
