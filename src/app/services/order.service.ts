import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { CartItem, Order, OrderStatus, PaymentMethod, ProductCategory } from '../models/order.model';
import { Store } from '../models/store.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private mockOrders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  
  private activeOrderSubject = new BehaviorSubject<Order | null>(null);
  public activeOrder$ = this.activeOrderSubject.asObservable();

  constructor(private authService: AuthService) {
    // Load initial orders
    this.loadInitialOrders();
  }

  private loadInitialOrders() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // This would typically come from an API
    // For demo purposes, we'll create some mock orders
    this.mockOrders = this.generateMockOrders(currentUser);
    this.ordersSubject.next(this.mockOrders);
    
    // Set the first non-completed order as active (if any)
    const activeOrder = this.mockOrders.find(order => 
      order.status !== OrderStatus.DELIVERED && 
      order.status !== OrderStatus.CANCELLED
    );
    
    if (activeOrder) {
      this.activeOrderSubject.next(activeOrder);
    }
  }

  private generateMockOrders(user: User): Order[] {
    // This would be replaced by actual order history from an API
    return [
      {
        id: '1001',
        items: [
          {
            product: {
              id: '1',
              name: 'Chicken Inn 2 Piece',
              description: 'Two pieces of our famous fried chicken',
              price: 5.99,
              image: 'assets/images/products/chicken-inn-2piece.jpg',
              category: ProductCategory.FOOD,
              storeId: '1',
              available: true
            },
            quantity: 2
          },
          {
            product: {
              id: '2',
              name: 'Chicken Inn Burger',
              description: 'Delicious chicken burger with lettuce, tomato, and special sauce',
              price: 4.50,
              image: 'assets/images/products/chicken-inn-burger.jpg',
              category: ProductCategory.FOOD,
              storeId: '1',
              available: true
            },
            quantity: 1
          }
        ],
        user: user,
        store: {
          id: '1',
          name: 'Chicken Inn',
          description: 'Zimbabwe\'s favorite fried chicken restaurant',
          address: 'Sam Nujoma Street, Harare',
          image: 'assets/images/stores/chicken-inn.jpg',
          categories: [ProductCategory.FOOD],
          rating: 4.5,
          deliveryTime: '25-35 min',
          deliveryFee: 2.50,
          isOpen: true,
          openingHours: '08:00',
          closingHours: '22:00',
          tags: ['Fast Food', 'Chicken', 'Burgers'],
          featured: true,
          city: 'Harare',
          province: 'Harare'
        },
        status: OrderStatus.DELIVERED,
        subtotal: 13.98,
        total: 16.48,
        deliveryAddress: user.addresses ? user.addresses[0].fullAddress : '123 Main St, Harare',
        deliveryFee: 2.50,
        serviceFee: 0,
        paymentMethod: PaymentMethod.ECOCASH,
        createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        estimatedDeliveryTime: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 minutes after order
        isPickup: false
      },
      {
        id: '1002',
        items: [
          {
            product: {
              id: '7',
              name: 'Paracetamol 500mg',
              description: 'Pain relief medication, pack of 20 tablets',
              price: 2.50,
              image: 'assets/images/products/paracetamol.jpg',
              category: ProductCategory.MEDICINE,
              storeId: '3',
              available: true
            },
            quantity: 1
          },
          {
            product: {
              id: '8',
              name: 'Vitamin C Tablets',
              description: 'Immune support, pack of 30 tablets',
              price: 6.99,
              image: 'assets/images/products/vitamin-c.jpg',
              category: ProductCategory.MEDICINE,
              storeId: '3',
              available: true
            },
            quantity: 1
          }
        ],
        user: user,
        store: {
          id: '3',
          name: 'Clicks Pharmacy',
          description: 'Your health is our priority',
          address: 'Borrowdale Road, Harare',
          image: 'assets/images/stores/clicks-pharmacy.jpg',
          categories: [ProductCategory.MEDICINE],
          rating: 4.7,
          deliveryTime: '30-45 min',
          deliveryFee: 2.00,
          isOpen: true,
          openingHours: '08:00',
          closingHours: '18:00',
          tags: ['Pharmacy', 'Health', 'Medicines'],
          city: 'Harare',
          province: 'Harare'
        },
        status: OrderStatus.OUT_FOR_DELIVERY,
        subtotal: 9.49,
        total: 11.49,
        deliveryAddress: user.addresses ? user.addresses[0].fullAddress : '123 Main St, Harare',
        deliveryFee: 2.00,
        serviceFee: 0,
        paymentMethod: PaymentMethod.VISA,
        createdAt: new Date(new Date().getTime() - 30 * 60 * 1000), // 30 minutes ago
        estimatedDeliveryTime: new Date(new Date().getTime() + 15 * 60 * 1000), // 15 minutes from now
        driverId: 'D1001',
        driverName: 'Tendai Moyo',
        driverPhone: '+263771234567',
        driverLocation: {
          latitude: -17.810901,
          longitude: 31.058216
        },
        isPickup: false
      }
    ];
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return this.orders$.pipe(
      map(orders => orders.find(order => order.id === id))
    );
  }

  getActiveOrder(): Observable<Order | null> {
    return this.activeOrder$;
  }

  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(order => order.status === status))
    );
  }

  placeOrder(items: CartItem[], store: Store, deliveryAddress: string, paymentMethod: PaymentMethod, isPickup: boolean, specialInstructions?: string): Observable<Order> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User must be logged in to place an order');
    }
    
    // Calculate total
    const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const deliveryFee = isPickup ? 0 : store.deliveryFee;
    const total = subtotal + deliveryFee;
    
    // Create new order
    const newOrder: Order = {
      id: `ORD${Math.floor(Math.random() * 10000)}`,
      items,
      user: currentUser,
      store,
      status: OrderStatus.PENDING,
      subtotal,
      total,
      deliveryAddress,
      deliveryFee,
      serviceFee: 0,
      paymentMethod,
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(new Date().getTime() + 45 * 60 * 1000), // 45 minutes from now
      specialInstructions,
      isPickup
    };
    
    // Add to orders and set as active
    this.mockOrders = [newOrder, ...this.mockOrders];
    this.ordersSubject.next(this.mockOrders);
    this.activeOrderSubject.next(newOrder);
    
    // Simulate order confirmation after delay
    setTimeout(() => {
      this.updateOrderStatus(newOrder.id!, OrderStatus.CONFIRMED);
    }, 5000);
    
    return of(newOrder).pipe(delay(1000)); // Simulate network delay
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.mockOrders;
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const updatedOrder = { ...orders[orderIndex], status };
      
      // Update driver location if order is out for delivery
      if (status === OrderStatus.OUT_FOR_DELIVERY && !orders[orderIndex].driverId) {
        // Assign a driver
        updatedOrder.driverId = 'D1001';
        updatedOrder.driverName = 'Tendai Moyo';
        updatedOrder.driverPhone = '+263771234567';
        updatedOrder.driverLocation = {
          latitude: -17.820901,
          longitude: 31.048216
        };
      }
      
      // Update orders array
      orders[orderIndex] = updatedOrder;
      this.mockOrders = [...orders];
      this.ordersSubject.next(this.mockOrders);
      
      // Update active order if needed
      if (this.activeOrderSubject.value?.id === orderId) {
        this.activeOrderSubject.next(updatedOrder);
      }
      
      // If order is delivered or cancelled, set active order to null
      if (status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED) {
        if (this.activeOrderSubject.value?.id === orderId) {
          // Find next active order if any
          const nextActiveOrder = this.mockOrders.find(order => 
            order.id !== orderId && 
            order.status !== OrderStatus.DELIVERED && 
            order.status !== OrderStatus.CANCELLED
          );
          
          this.activeOrderSubject.next(nextActiveOrder || null);
        }
      }
    }
  }

  cancelOrder(orderId: string): Observable<boolean> {
    this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
    return of(true).pipe(delay(1000)); // Simulate network delay
  }

  reorder(orderId: string): Observable<CartItem[]> {
    const order = this.mockOrders.find(o => o.id === orderId);
    if (!order) {
      return of([]);
    }
    
    return of(order.items).pipe(delay(500)); // Simulate network delay
  }
}
