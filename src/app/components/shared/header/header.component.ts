import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() showLocationSelector: boolean = false;
  @Input() currentLocation: string = '';
  @Input() showProfileButton: boolean = true;

  constructor() {}

  openLocationSelector() {
    // Implement location selector logic
  }
}