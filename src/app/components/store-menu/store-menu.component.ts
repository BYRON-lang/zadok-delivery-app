import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';

type MenuFilter = 'All' | 'Veg' | 'Non-Veg';

@Component({
  selector: 'app-store-menu',
  templateUrl: './store-menu.component.html',
  styleUrls: ['./store-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ProductCardComponent]
})
export class StoreMenuComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: MenuFilter = 'All';
  products: Product[] = [
    {
      id: '1',
      name: 'Paneer Tikka Masala',
      description: 'Soft paneer pieces cooked in a thick tomato-based gravy with aromatic spices',
      price: 259,
      image: 'assets/images/products/paneer-tikka.jpg',
      category: 'FOOD',
      isVeg: true,
      rating: 3.7,
      ratingCount: 6,
      available: true,
      quantity: 1
    },
    {
      id: '2',
      name: 'Chicken Tikka Masala',
      description: 'Juicy chicken tikka pieces simmered in a creamy, mildly spiced curry sauce',
      price: 259,
      image: 'assets/images/products/chicken-tikka.jpg',
      category: 'FOOD',
      isVeg: false,
      rating: 4.1,
      ratingCount: 28,
      available: true,
      quantity: 1
    },
    {
      id: '3',
      name: 'Paneer Lababdar',
      description: 'Paneer cooked in a rich and creamy onion-tomato gravy with aromatic spices',
      price: 259,
      image: 'assets/images/products/paneer-lababdar.jpg',
      category: 'FOOD',
      isVeg: true,
      rating: 4.1,
      ratingCount: 11,
      available: true,
      quantity: 1
    },
    {
      id: '4',
      name: 'Chicken Lababdar',
      description: 'Tender chicken pieces in a creamy, mildly spiced gravy with rich flavors',
      price: 259,
      image: 'assets/images/products/chicken-lababdar.jpg',
      category: 'FOOD',
      isVeg: false,
      rating: 4.3,
      ratingCount: 15,
      available: true,
      quantity: 1
    }
  ];

  filteredProducts: Product[] = [];

  ngOnInit() {
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesFilter = this.selectedFilter === 'All' ||
                          (this.selectedFilter === 'Veg' && product.isVeg) ||
                          (this.selectedFilter === 'Non-Veg' && !product.isVeg);
      
      return matchesSearch && matchesFilter;
    });
  }

  onFilterChange(filter: MenuFilter) {
    this.selectedFilter = filter;
    this.filterProducts();
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterProducts();
  }

  addToCart(product: Product) {
    // Implement cart functionality
    console.log('Adding to cart:', product);
  }
}