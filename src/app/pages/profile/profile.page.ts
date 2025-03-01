import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonToggle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonAvatar,
  IonBadge,
  ToastController,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  cardOutline,
  settingsOutline,
  notificationsOutline,
  addOutline,
  createOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { User, NotificationPreferences } from '../../models/user.model';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { OrderHistoryComponent } from '../../components/order-history/order-history.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonToggle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonAvatar,
    IonBadge,
    NgIf,
    NgForOf,
    FormsModule,
    HeaderComponent,
    OrderHistoryComponent
  ]
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  notificationPreferences: NotificationPreferences = {
    orderUpdates: true,
    promotions: false,
    specialDeals: false,
    emailNotifications: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    addIcons({
      personOutline,
      mailOutline,
      callOutline,
      locationOutline,
      cardOutline,
      settingsOutline,
      notificationsOutline,
      addOutline,
      createOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    // Load user data
    this.loadUserData();
  }

  async loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.user = user;
    } else {
      const toast = await this.toastController.create({
        message: 'Please sign in to view your profile',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      this.router.navigate(['/login']);
    }
  }

  async updateProfile() {
    // Implement profile update logic
  }

  async saveNotificationPreferences() {
    // Implement notification preferences saving logic
  }

  async signOut() {
    // Implement sign out logic
  }
}
