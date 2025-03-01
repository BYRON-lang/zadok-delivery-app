import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RewardsPage implements OnInit {
  currentUser: User | null = null;
  rewardPoints: number = 0;
  availableRewards = [
    {
      id: 1,
      name: 'Free Delivery',
      description: 'Get free delivery on your next order',
      pointsCost: 500,
      icon: 'bicycle-outline'
    },
    {
      id: 2,
      name: '10% Off',
      description: 'Get 10% off on your next order',
      pointsCost: 1000,
      icon: 'pricetag-outline'
    },
    {
      id: 3,
      name: 'Priority Delivery',
      description: 'Get priority delivery on your next order',
      pointsCost: 750,
      icon: 'flash-outline'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // In a real app, we would fetch the reward points from a backend service
    this.rewardPoints = 750; // Mock data
  }

  canRedeemReward(pointsCost: number): boolean {
    return this.rewardPoints >= pointsCost;
  }

  redeemReward(rewardId: number) {
    const reward = this.availableRewards.find(r => r.id === rewardId);
    if (reward && this.canRedeemReward(reward.pointsCost)) {
      this.rewardPoints -= reward.pointsCost;
      // In a real app, we would call a backend service to process the redemption
      console.log(`Redeemed reward: ${reward.name}`);
    }
  }
}