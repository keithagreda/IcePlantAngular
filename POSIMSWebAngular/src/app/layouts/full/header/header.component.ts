import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  GetNotificationDto,
  NotificationService,
} from 'src/app/services/nswag/nswag.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SignalRService } from 'src/app/services/signalr/signalr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @ViewChild('notificationMenuTrigger')
  notificationMenuTrigger!: MatMenuTrigger;
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  // notifications = [
  //   { message: 'New order received' },
  //   { message: 'Server maintenance scheduled' },
  //   // Add more notifications as needed
  // ];
  notifications: GetNotificationDto[] = [];
  notificationCount = 0;
  signalRNotif: string[] = [];
  private subscription!: Subscription;

  constructor(
    public authService: AuthService,
    private signalRService: SignalRService,
    private notificationService: NotificationService,
    private _toastr: ToastrService
  ) {}
  ngOnInit(): void {
    if (this.authService.hasRole('Admin')) {
      this.getNotifications();
      this.listenForAdminNotifications();
    }
  }

  listenForAdminNotifications() {
    this.signalRService.onAdminNotificationReceived((message) => {
      this._toastr.info(message);
      this.getNotifications();
    });
  }

  getNotifications() {
    this.notificationService
      .getAllNotification(undefined, undefined, undefined, undefined, undefined)
      .subscribe({
        next: (res) => {
          this.notifications = res.data.items || [];
          this.notificationCount = res.data.totalCount || 0;
        },
        error: (err) => {},
      });
  }

  onNotificationClick() {
    this.notificationMenuTrigger.openMenu();
  }

  onLogout() {
    this.authService.onlogout();
  }
}
