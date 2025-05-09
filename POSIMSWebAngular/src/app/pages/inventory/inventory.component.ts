import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AuthenticateUserComponent } from 'src/app/components/authenticate-user/authenticate-user.component';
import { CreateOrEditStocksReceivingModalComponent } from 'src/app/components/create-or-edit-stocks-receiving-modal/create-or-edit-stocks-receiving-modal.component';
import { CreateStocksReconciliationComponent } from 'src/app/components/create-stocks-reconciliation/create-stocks-reconciliation.component';
import { CurrentStocksComponent } from 'src/app/components/current-stocks/current-stocks.component';
import { InventoryLogsComponent } from 'src/app/components/inventory-logs/inventory-logs.component';
import { StockCardComponent } from 'src/app/components/stock-card/stock-card.component';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  InventoryService,
  NotificationService,
} from 'src/app/services/nswag/nswag.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    MaterialModule,
    CurrentStocksComponent,
    CreateOrEditStocksReceivingModalComponent,
    InventoryLogsComponent,
    CommonModule,
    CreateStocksReconciliationComponent,
    StockCardComponent,
    AuthenticateUserComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  @ViewChild(CurrentStocksComponent)
  currentStocksComponent!: CurrentStocksComponent;

  @ViewChild(InventoryLogsComponent)
  inventoryLogs!: InventoryLogsComponent;

  @ViewChild(AuthenticateUserComponent)
  authenticateUserComponent!: AuthenticateUserComponent;

  @ViewChild(StockCardComponent)
  stockCardComponent!: StockCardComponent;

  @ViewChild(CreateOrEditStocksReceivingModalComponent)
  createOrEditStocksReceivingModalComponent!: CreateOrEditStocksReceivingModalComponent;

  @ViewChild(CreateStocksReconciliationComponent)
  createStocksReconciliationComponent!: CreateStocksReconciliationComponent;
  saving = false;
  constructor(
    private _inventoryService: InventoryService,
    public authService: AuthService
  ) {}

  closeInventory() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to proceed with this action?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saving = true;
        // Handle the confirmed action here
        this._inventoryService.closeInventory().subscribe({
          next: (res) => {
            this.saving = false;
            if (res.isSuccess) {
              
              Swal.fire(
                'Confirmed!',
                'Your action has been confirmed.',
                'success'
              );
              this.currentStocksComponent.getCurrentStocks();
              this.inventoryLogs.getAllInventory();
              this.stockCardComponent.getStockCard();
              return;
            }
            Swal.fire('Error!', res.message, 'error');
          },
          error: (err) => {
            this.saving = false;
            Swal.fire(
              'Error!',
              'An error occurred while processing your request.',
              'error'
            );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Handle the cancelled action here
        Swal.fire('Cancelled', 'Your action has been cancelled.', 'error');
      }
    });
  }

  getCurrentStocks() {
    this.currentStocksComponent.getCurrentStocks();
  }

  showCorEStocksReceivingModal(event: boolean) {
    this.createOrEditStocksReceivingModalComponent.show();
  }

  showCorEStocksReconciliationModal() {
    this.createStocksReconciliationComponent.show();
  }

  openAuthentication() {
    this.authenticateUserComponent.visible = true;
  }
}
