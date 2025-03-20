import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private authService: AuthService
  ) {}

  startConnection() {
    const token = this.authService.getToken(); // 🔥 Retrieve JWT token

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7050/notificationHub', {
        accessTokenFactory: () => token  // ✅ Pass token when connecting
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR'))
      .catch(err => console.log('SignalR Connection Error: ', err));
  }
  onAdminNotificationReceived(callback: (message: string) => void) {
    this.hubConnection.on('AdminNotification', callback);
  }
  
}
