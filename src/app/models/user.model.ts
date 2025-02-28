export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  addresses?: Address[];
  defaultAddressId?: string;
  profileImage?: string;
  loyaltyPoints?: number;
  referralCode?: string;
  preferredLanguage?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Work", "Other"
  fullAddress: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  specialDeals: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}
