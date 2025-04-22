import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { MaterialModule } from 'src/app/material.module';
import { CustomerDto, CustomerService } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss'],
})
export class CustomerTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<CustomerDto>([]);
  displayedColumns: string[] = [
    'customerFullName',
    'pendingTransactions',
    'totalUnpaidAmount',
    'customerType',
  ];
  totalRecords = 0;
  hasPendingTransFilter: boolean | null = null;
  textFilter = '';

  constructor(
    private _customerService: CustomerService, // Assuming you have a service to fetch customer data
  ) {}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(event?: PageEvent): void {
    const currentPage = event?.pageIndex ?? 0;
    const pageSize = event?.pageSize ?? 5;

    this._customerService.getAllCustomer(
      this.hasPendingTransFilter,
      this.textFilter,
      currentPage + 1,
      pageSize 
    ).subscribe({
      next: (res) => {
        this.dataSource.data = res.data.items ?? [];
        this.totalRecords = res.data.totalCount ?? 0;
      },
      error: (err) => {

      }
    });
    // Simulate API call
  }
}
