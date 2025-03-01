import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import * as THREE from 'three';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.page.html',
  styleUrls: ['./order-tracking.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OrderTrackingPage implements OnInit, AfterViewInit {
  @ViewChild('mapCanvas') mapCanvas!: ElementRef;
  activeOrder: Order | null = null;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  deliveryMarker!: THREE.Mesh;
  storeMarker!: THREE.Mesh;
  destinationMarker!: THREE.Mesh;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getActiveOrder().subscribe(order => {
      this.activeOrder = order;
      if (order?.driverLocation) {
        this.updateDeliveryMarker(order.driverLocation);
      }
    });
  }

  ngAfterViewInit() {
    this.initScene();
  }

  private initScene() {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.mapCanvas.nativeElement, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Add markers
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const deliveryMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const storeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const destinationMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    this.deliveryMarker = new THREE.Mesh(geometry, deliveryMaterial);
    this.storeMarker = new THREE.Mesh(geometry, storeMaterial);
    this.destinationMarker = new THREE.Mesh(geometry, destinationMaterial);

    this.scene.add(this.deliveryMarker);
    this.scene.add(this.storeMarker);
    this.scene.add(this.destinationMarker);

    // Position camera
    this.camera.position.z = 5;

    // Start animation loop
    this.animate();
  }

  private updateDeliveryMarker(location: { latitude: number; longitude: number }) {
    if (this.deliveryMarker) {
      // Convert GPS coordinates to scene coordinates
      this.deliveryMarker.position.x = location.longitude / 10;
      this.deliveryMarker.position.y = location.latitude / 10;
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  getOrderStatus(): string {
    return this.activeOrder?.status || OrderStatus.PENDING;
  }

  getEstimatedTime(): string {
    if (!this.activeOrder?.estimatedDeliveryTime) return 'Calculating...';
    const now = new Date();
    const estimated = new Date(this.activeOrder.estimatedDeliveryTime);
    const diff = Math.floor((estimated.getTime() - now.getTime()) / 1000 / 60);
    return `${diff} minutes`;
  }

  getDriverInfo(): string {
    if (!this.activeOrder?.driverName) return 'Assigning driver...';
    return `${this.activeOrder.driverName} - ${this.activeOrder.driverPhone}`;
  }
}