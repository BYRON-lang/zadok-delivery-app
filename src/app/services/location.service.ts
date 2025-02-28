import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentPositionSubject = new BehaviorSubject<Position | null>(null);
  public currentPosition$ = this.currentPositionSubject.asObservable();

  // Mock cities in Zimbabwe
  private zimbabweCities = [
    { name: 'Harare', province: 'Harare' },
    { name: 'Bulawayo', province: 'Bulawayo' },
    { name: 'Chitungwiza', province: 'Harare' },
    { name: 'Mutare', province: 'Manicaland' },
    { name: 'Gweru', province: 'Midlands' },
    { name: 'Kwekwe', province: 'Midlands' },
    { name: 'Kadoma', province: 'Mashonaland West' },
    { name: 'Masvingo', province: 'Masvingo' },
    { name: 'Chinhoyi', province: 'Mashonaland West' },
    { name: 'Victoria Falls', province: 'Matabeleland North' }
  ];

  constructor() {
    this.getCurrentPosition();
  }

  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentPositionSubject.next(position);
      return position;
    } catch (error) {
      console.error('Error getting current position', error);
      // Default to Harare coordinates if geolocation fails
      const defaultPosition: Position = {
        coords: {
          latitude: -17.824858,
          longitude: 31.053028,
          accuracy: 0,
          altitudeAccuracy: null,
          altitude: null,
          speed: null,
          heading: null
        },
        timestamp: Date.now()
      };
      this.currentPositionSubject.next(defaultPosition);
      return defaultPosition;
    }
  }

  watchPosition(): Observable<Position> {
    return from(Geolocation.watchPosition(
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 },
      (position) => {
        this.currentPositionSubject.next(position);
      }
    )).pipe(
      map(() => this.currentPositionSubject.value as Position),
      catchError(error => {
        console.error('Error watching position', error);
        return of(this.currentPositionSubject.value as Position);
      })
    );
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getCities(): Observable<{name: string, province: string}[]> {
    return of(this.zimbabweCities);
  }

  getProvinces(): Observable<string[]> {
    const provinces = [...new Set(this.zimbabweCities.map(city => city.province))];
    return of(provinces);
  }

  getCitiesByProvince(province: string): Observable<string[]> {
    const cities = this.zimbabweCities
      .filter(city => city.province === province)
      .map(city => city.name);
    return of(cities);
  }
}
