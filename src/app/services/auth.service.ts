import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthResponse, User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  constructor() {
    this.loadStoredUser();
  }

  private async loadStoredUser() {
    try {
      const { value: token } = await Preferences.get({ key: this.tokenKey });
      const { value: userData } = await Preferences.get({ key: this.userKey });
      
      if (token && userData) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Failed to load stored user', error);
    }
  }

  // In a real app, this would make an HTTP request to your backend
  login(email: string, password: string): Observable<AuthResponse> {
    // Mock login - replace with actual API call
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: email,
      phone: '+1234567890',
      addresses: [{
        id: '1',
        label: 'Home',
        fullAddress: '123 Main St',
        city: 'Harare',
        province: 'Harare',
        isDefault: true
      }]
    };
    
    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token'
    };

    return of(mockResponse).pipe(
      tap(async (response) => {
        await Preferences.set({ key: this.tokenKey, value: response.token });
        await Preferences.set({ key: this.userKey, value: JSON.stringify(response.user) });
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(user: User, password: string): Observable<AuthResponse> {
    // Mock registration - replace with actual API call
    const mockResponse: AuthResponse = {
      user: { ...user, id: Math.random().toString(36).substr(2, 9) },
      token: 'mock-jwt-token'
    };

    return of(mockResponse).pipe(
      tap(async (response) => {
        await Preferences.set({ key: this.tokenKey, value: response.token });
        await Preferences.set({ key: this.userKey, value: JSON.stringify(response.user) });
        this.currentUserSubject.next(response.user);
      })
    );
  }

  async logout() {
    await Preferences.remove({ key: this.tokenKey });
    await Preferences.remove({ key: this.userKey });
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async updateUserProfile(user: User): Promise<User> {
    // Mock update - replace with actual API call
    const updatedUser = { ...this.getCurrentUser(), ...user };
    await Preferences.set({ key: this.userKey, value: JSON.stringify(updatedUser) });
    this.currentUserSubject.next(updatedUser);
    return updatedUser;
  }
}
