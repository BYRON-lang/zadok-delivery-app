import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class OrderHistoryComponent implements OnInit {
  @Input() userId!: string;
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  getOrderStatusColor(status: string): string {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'primary';
      case 'OUT_FOR_DELIVERY':
        return 'tertiary';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'medium';
    }
  }
}