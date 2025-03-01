import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonIcon, IonItem, IonLabel],
})
export class Tab1Page {
  constructor() {}
}
