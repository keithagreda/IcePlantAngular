import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  CreateNotificationDto,
  NotificationService,
  PaymentStatus,
  SalesHeaderDto,
  SalesService,
  SaleType,
  ViewSalesHeaderDto,
  VoidRequestService,
} from 'src/app/services/nswag/nswag.service';
import { ViewSalesDetailsV1Component } from 'src/app/components/view-sales-details-v1/view-sales-details-v1.component';
import { LoadingService } from 'src/app/services/loading.service';
import { SalesSummaryComponent } from 'src/app/components/sales-summary/sales-summary.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { TabViewModule } from 'primeng/tabview';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateTime } from 'luxon';

export enum SaleTypeV1 {
    Cash = 0,
    PurchaseOrder = 1,
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    MaterialModule,
    ViewSalesDetailsV1Component,
    MatTableModule,
    MatPaginatorModule,
    SalesSummaryComponent,
    TabViewModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  @ViewChild(ViewSalesDetailsV1Component)
  viewSalesDetailsComponent!: ViewSalesDetailsV1Component;
  @ViewChild(SalesSummaryComponent)
  salesSummaryComponent!: SalesSummaryComponent;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<SalesHeaderDto>([]);
  visible = false;
  displayedColumns1: string[] = [
    'transNum',
    'customerName',
    'totalAmount',
    'transactionDate',
    'paymentStatus',
    'saleType',
    'soldBy',
  ];
  totalRecords = 0;
  filterForm!: FormGroup;
  saleTypeEnum = SaleTypeV1;
  paymentStatusEnum = PaymentStatus;

  constructor(
    private _notificationService: NotificationService,
    private _toastr: ToastrService,
    private _salesService: SalesService,
    private _loadingService: LoadingService,
    private _voidRequest: VoidRequestService,
    private fb: FormBuilder,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initializeFilterForm();
    this.getSales();
    this.updateDisplayedColumns();
  }

  initializeFilterForm(): void {
    this.filterForm = this.fb.group(
      {
        transNum: [''],
        minTransDate: [null],
        maxTransDate: [null],
        saleType: [-1], // Default to -1 (null equivalent)
        paymentStatus: [-1], // Default to -1 (null equivalent)
      },
      {
        validators: this.dateRangeValidator, // Apply here at group level if necessary
      }
    );
  }

  setDateTimeFilterToCurrDay() {
    this.filterForm.get('minTransDate')?.setValue(new Date());
    this.filterForm.get('maxTransDate')?.setValue(new Date());
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const timeOpened = group.get('minTransDate')?.value;
    const timeClosed = group.get('maxTransDate')?.value;

    if (timeOpened == undefined && timeClosed == undefined) {
      return null; // Valid
    }

    // Check if the timeClosed is later than timeOpened
    if (timeOpened && timeClosed && timeClosed < timeOpened) {
      return { dateRangeInvalid: true };
    }
    return null; // Valid
  }

  onFilter() {
    if (this.filterForm.valid) {
      this.getSales();
    }
  }

  clearDates(): void {
    this.filterForm.patchValue({
      timeOpened: null,
      timeClosed: null,
      saleType: -1,
      paymentStatus: -1,
    });
    const timeOpened = this.filterForm.get('minTransDate')?.value;
    const timeClosed = this.filterForm.get('maxTransDate')?.value;
    console.log(timeOpened);
    console.log(timeClosed);
  }

  updateDisplayedColumns() {
    if (this.authService.hasRole('Admin') || this.authService.hasRole('Cashier')) {
      this.displayedColumns1.push('action');
    }
  }

  closeForm() {
    this.visible = false;
  }

  getSales(event?: PageEvent) {
    // Retrieve form values
    const minTransDate = this.filterForm.get('minTransDate')?.value;
    const maxTransDate = this.filterForm.get('maxTransDate')?.value;
    const transNum = this.filterForm.get('transNum')?.value;
    const saleType = this.filterForm.get('saleType')?.value;
    const paymentStatus = this.filterForm.get('paymentStatus')?.value;

    // Convert dates to Singapore Time (SGT, UTC+8) and back to JavaScript Date objects
    const minTransDateSGT = minTransDate
      ? DateTime.fromJSDate(minTransDate).setZone('Asia/Singapore').toJSDate()
      : null;
    const maxTransDateSGT = maxTransDate
      ? DateTime.fromJSDate(maxTransDate).setZone('Asia/Singapore').toJSDate()
      : null;

    const currentPage = event?.pageIndex ?? 0;
    const pageSize = event?.pageSize ?? 5;

    // Call the API with the converted dates
    this._salesService
      .getSales(
        transNum,
        minTransDateSGT,
        maxTransDateSGT,
        paymentStatus,
        saleType,
        currentPage + 1,
        pageSize
      )
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dataSource.data = res.data.items ?? [];
            this.totalRecords = res.data.totalCount ?? 0;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  requestForVoid(headerId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to request a void for this transaction",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#635bff',
      cancelButtonColor: '#ff6692',
      confirmButtonText: 'Confirm',
      customClass: {
        popup: 'custom-swal-popup',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this._voidRequest.createVoidRequest(headerId).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this._toastr.success(res.data);
              let notificationDto = new CreateNotificationDto();
              notificationDto.title = "Void Request";
              notificationDto.desc = "You have received a void request";
              this._notificationService.createNotification(notificationDto).subscribe({
                next: (res) => {
                  console.info("Notification sent");
                }, error: (err) => {
                  console.error("Something went wrong while sending notification ", err);
                }
              });
              return;
            }
            this._toastr.error(res.data);
            return;
          },
          error: (err) => {
            this._toastr.error(err);
          }
        })
      }
    });
  }

  showSalesDetails(headerId: string) {
    this.visible = true;
    this._loadingService.show();
    let viewSalesHeaderDto: ViewSalesHeaderDto = new ViewSalesHeaderDto();
    this._salesService.viewSales(false, headerId, null, null, null).subscribe({
      next: (res) => {
        this._loadingService.hide();
        if (
          res.isSuccess &&
          res.data &&
          res.data.items &&
          res.data.items.length > 0
        ) {
          viewSalesHeaderDto = res.data.items[0];
          console.log();

          this.viewSalesDetailsComponent.show(viewSalesHeaderDto);
        } else {
          console.warn('No sales data available');
          this._toastr.error('No Sales Detail Available');
        }
      },
      error: (error) => {
        this._loadingService.hide();
        this._toastr.error('Something went wrong.. ' + error);
      },
    });
  }
}
