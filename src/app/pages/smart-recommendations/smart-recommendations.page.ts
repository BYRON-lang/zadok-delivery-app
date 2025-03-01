import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AIRecommendation, RecommendedProduct, RecommendedStore } from '../../models/recommendation.model';
import { RecommendationService } from '../../services/recommendation.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smart-recommendations',
  templateUrl: './smart-recommendations.page.html',
  styleUrls: ['./smart-recommendations.page.scss']
})
export class SmartRecommendationsPage implements OnInit {
  recommendations$: Observable<AIRecommendation | null>;
  selectedSegment = 'products';

  constructor(
    private recommendationService: RecommendationService,
    private cartService: CartService,
    private router: Router
  ) {
    this.recommendations$ = this.recommendationService.getRecommendations();
  }

  ngOnInit() {
    this.refreshRecommendations();
  }

  refreshRecommendations() {
    this.recommendationService.refreshRecommendations().subscribe();
  }

  addToCart(product: RecommendedProduct) {
    this.cartService.addItem({
      product: product,
      quantity: 1,
      store: product.store
    });
  }

  viewStore(store: RecommendedStore) {
    this.router.navigate(['/store', store.id]);
  }

  viewARContent(store: RecommendedStore) {
    if (store.arContent) {
      this.router.navigate(['/ar-view', store.id]);
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  getTimeOfDayGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }
}