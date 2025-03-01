import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonCard, IonIcon, IonButton, IonText } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { star, timeOutline, addOutline } from 'ionicons/icons';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonButton, IonText, NgIf]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  constructor() {
    addIcons({ star, timeOutline, addOutline });
  }

  onProductClick() {
    this.productClick.emit(this.product);
  }
}