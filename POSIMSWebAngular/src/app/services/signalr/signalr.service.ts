import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;
  private apiUrl = environment.apiBaseUrl;

  constructor() {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiUrl + '/notificationHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Error: ', err));
  }

  onAdminNotificationReceived(callback: (message: string) => void) {
    this.hubConnection.on('AdminNotification', callback);
  }
  
}
