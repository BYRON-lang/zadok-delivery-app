import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { locationOutline, personCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, NgIf]
})
export class HeaderComponent {
  @Input() showLocationSelector = false;
  @Input() currentLocation: string | null = '';
  @Input() showProfileButton = false;

  constructor(private router: Router) {
    addIcons({ locationOutline, personCircleOutline });
  }

  openLocationSelector() {
    // Implement location selection logic
    console.log('Opening location selector...');
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }
}