import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonText } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { closeOutline, removeOutline, addOutline, timeOutline, star } from 'ionicons/icons';
import { Product } from '../../models/product.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonText, NgIf]
})
export class ProductDetailComponent {
  @Input() product!: Product;
  quantity: number = 1;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, removeOutline, addOutline, timeOutline, star });
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  addToCart() {
    this.modalCtrl.dismiss({
      product: this.product,
      quantity: this.quantity
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}