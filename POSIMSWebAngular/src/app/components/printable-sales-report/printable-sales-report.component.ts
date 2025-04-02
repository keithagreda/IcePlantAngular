import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from 'src/app/material.module';
import { AppSideLoginComponent } from 'src/app/pages/authentication/side-login/side-login.component';
import { SalesService, SalesSummaryDto } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-printable-sales-report',
  standalone: true,
  imports: [
    DialogModule,
        ReactiveFormsModule,
        MaterialModule,
        DropdownModule,
        CommonModule,
        FormsModule,
        AppSideLoginComponent,
        RouterModule,
        MatButtonModule,
  ],
  templateUrl: './printable-sales-report.component.html',
  styleUrl: './printable-sales-report.component.scss'
})
export class PrintableSalesReportComponent {
  dataSource = new MatTableDataSource<SalesSummaryDto>([]);
  displayedColumns1: string[] = [
    'transNum',
    'productName',

    'dateTime',
    'quantity',
    'rate',
    'totalAmount',
    'customerName',
    'soldBy',
  ];
  constructor(private _salesService: SalesService) {
    
  }
  
}
