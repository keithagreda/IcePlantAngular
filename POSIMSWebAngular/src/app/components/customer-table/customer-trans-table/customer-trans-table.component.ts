import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MaterialModule } from 'src/app/material.module';
import { CustomerService, CustomerWithTransDto } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-customer-trans-table',
  standalone: true,
  imports: [
    DialogModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        ButtonModule,
    TableModule, 
    CommonModule],
  templateUrl: './customer-trans-table.component.html',
  styleUrl: './customer-trans-table.component.scss'
})
export class CustomerTransTableComponent {
  expandedRows = {};
  customerTrans: CustomerWithTransDto[] = [];
  constructor(private _customerService: CustomerService) {
    
  }

  ngOnInit(): void {
    // this.getCustomers();
    
  }

  onRowExpand(event: TableRowExpandEvent) {
    console.log(event.data);
}

onRowCollapse(event: TableRowCollapseEvent) {
  console.log(event.data)
}

  getCustomerTrans(customerId: string) {
    this._customerService.getCustomerTrans(
      customerId,
      undefined,
      undefined,
      undefined
    ).subscribe({
      next: (res) => {
        this.customerTrans = res.data.items ?? [];
      },
      error: () => {

      }
    })
  }
}
