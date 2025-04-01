import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MaterialModule } from 'src/app/material.module';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  CreateInventoryReconcillationDto,
  CurrentInventoryDto,
  InventoryReconcillationService,
  InventoryService,
} from 'src/app/services/nswag/nswag.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthenticateUserComponent } from '../authenticate-user/authenticate-user.component';

@Component({
  selector: 'app-current-stocks',
  standalone: true,
  imports: [
    MaterialModule,
    MatMenuModule,
    MatButtonModule,
    CommonModule,
    ProgressSpinnerModule,
    DialogModule,
    InputNumberModule,
    FormsModule,
    AuthenticateUserComponent
  ],
  templateUrl: './current-stocks.component.html',
  styleUrl: './current-stocks.component.scss',
})
export class CurrentStocksComponent implements OnInit {
  @ViewChild(AuthenticateUserComponent)
  authenticateUserComponent!: AuthenticateUserComponent;

  displayedColumns: string[] = [
    'productName',
    'begQty',
    'received',
    'reconcillation',
    'sales',
    'currentStock',
  ];

  dataSource: CurrentInventoryDto[] = [];
  loading = false;
  reconcileQty = 0;
  displayDialog = false;
  selectedProduct: CurrentInventoryDto | null = null;

  constructor(
    private _inventoryService: InventoryService,
    private _reconcileService: InventoryReconcillationService,
    private _toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.getCurrentStocks();
  }

  updateDisplayedColumns() {
    if (this.authService.hasRole('Admin') || this.authService.hasRole('Inventory')) {
      this.displayedColumns.push('action');
    }
  }

  getCurrentStocks() {
    this.loading = true;
    this._inventoryService.getCurrentStocks().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.dataSource = res.data;
        }
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  openReconcileDialog(product: CurrentInventoryDto) {
    this.selectedProduct = product;
    this.reconcileQty = 0;
    // Authenticate first
    this.authenticateUserComponent.visible = true;
  }

  openDialog(event: any) {
    this.displayDialog = true;
  }

  reconcile() {
    if (this.selectedProduct && this.reconcileQty !== 0) {
      let param = new CreateInventoryReconcillationDto();
      param.productId = this.selectedProduct.productId;
      param.quantity = this.reconcileQty;
      this._reconcileService.createInvenReconcillation(param).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this._toastr.success(res.data);
            this.getCurrentStocks();
          }
          if (!res.isSuccess) {
            this._toastr.error(res.data);
          }
        },
        error: (err) => {
          this._toastr.error(err);
        },
      });
      this.displayDialog = false;
    }
  }
}
