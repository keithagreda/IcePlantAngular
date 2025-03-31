import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root', // Ensures this service is a singleton
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<string | null>(null);
  public notification$ = this.notificationSubject.asObservable();
  private isConnected = false; // Prevent multiple connections

  constructor(private authService: AuthService) {
    this.startConnection(); // Automatically start connection when the service is created
  }

  public startConnection() {
    if (this.isConnected) return; // Prevent multiple connections

    const token = this.authService.getToken();

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.1.67:8081/notificationHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('✅ Connected to SignalR');
        this.isConnected = true;
      })
      .catch((err) => {
        console.error('❌ SignalR Connection Error:', err);
      });

    this.hubConnection.on('AdminNotification', (message: string) => {
      this.notificationSubject.next(message);
    });
  }

  public onAdminNotificationReceived(callback: (message: string) => void) {
    this.hubConnection.on('AdminNotification', callback);
  }

  public stopConnection() {
    if (this.hubConnection && this.isConnected) {
      this.hubConnection.stop().then(() => {
        console.log('🛑 SignalR Disconnected');
        this.isConnected = false;
      });
    }
  }
}
