import { Component, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  searchOutline, 
  cartOutline, 
  receiptOutline, 
  personOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, NgIf]
})
export class TabsPage implements OnInit {
  cartItemCount$!: Observable<number>;
  cartItemCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
    addIcons({ 
      homeOutline, 
      searchOutline, 
      cartOutline, 
      receiptOutline, 
      personOutline 
    });
  }

  ngOnInit() {
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }
}
