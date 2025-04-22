import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DateTime } from 'luxon';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MaterialModule } from 'src/app/material.module';
import { AppSideLoginComponent } from 'src/app/pages/authentication/side-login/side-login.component';
import { PaymentService, SalesPaymentHeaderReportV1Dto, SalesService, SalesSummaryDto } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-printable-payment-report',
  standalone: true,
  imports: [
    DialogModule,
        ReactiveFormsModule,
        MaterialModule,
        DropdownModule,
        CommonModule,
        FormsModule,
        RouterModule,
        MatButtonModule,
        ProgressSpinnerModule,
  ],
  templateUrl: './printable-payment-report.component.html',
  styleUrl: './printable-payment-report.component.scss'
})
export class PrintablePaymentReportComponent implements OnInit{
  dataSource: SalesPaymentHeaderReportV1Dto[] = [];
  totalSales: number = 0;
  totalAmount: number = 0;
  totalUnpaid: number = 0;
  dateFrom: Date = DateTime.now().setZone('Asia/Manila').startOf('day').toJSDate(); // Set to Manila time at the start of the day
  dateTo: Date = DateTime.now().setZone('Asia/Manila').endOf('day').toJSDate(); // Set to Manila time at the end of the day
  loading = false;

  constructor(private _paymentService: PaymentService) {
    
  }
  ngOnInit(): void {
    this.getSalesReport();
  }

  setDateRange(range: 'daily' | 'weekly' | 'monthly' | 'yearly'): void {
    // Get today's date in Manila time (UTC+8)
    const today = DateTime.now().setZone('Asia/Manila'); // Set to Manila time zone
  
    switch (range) {
      case 'daily':
        // Set to midnight Manila time
        this.dateFrom = today.startOf('day').toJSDate();
        this.dateTo = today.endOf('day').toJSDate();
        break;
      case 'weekly':
        // Start of the week (Sunday) in Manila time
        this.dateFrom = today.startOf('week').toJSDate();
        this.dateTo = today.endOf('week').toJSDate();
        break;
      case 'monthly':
        // First day of the month in Manila time
        this.dateFrom = today.startOf('month').toJSDate();
        this.dateTo = today.endOf('month').toJSDate();
        break;
      case 'yearly':
        // First day of the year in Manila time
        this.dateFrom = today.startOf('year').toJSDate();
        this.dateTo = today.endOf('year').toJSDate();
        break;
    }
  
    this.getSalesReport(); // Refresh the report with the new date range
  }

  print(): void {
    const printContents = document.querySelector('.printable')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=1000,height=1000');
  
    if (popupWin && printContents) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              /* Add your styles for print here or import them */
              .header{
                display: flex;
                justify-content: space-between;
                  align-items: flex-start;
                flex-wrap: wrap;
              }

              .printable{
                position: relative;
              }

              .signature-container {
                margin-top: 100px;
                break-before: page; /* Forces this content to a new page if necessary */
              }

              .signature-item {
                display: inline-block;
                width: 40%;  /* Adjust width as needed */
                text-align: center;
                margin-right: 5%;
              }

              .signature-item p {
                margin: 0;
              }

              .title {
                flex: 1 1 auto;
              }

              .date{
                display: flex;
                gap: 10px;
                justify-content: space-between
              }

              .date-range{
                display: flex;
                flex-direction: column;
                text-align: left;
              }
              body {
                font-family: 'Poppins', sans-serif;
              }

              .sales-summary-table {
                width: 100%;
                border-collapse: separate;
              }

              .sales-summary-table thead th {
                background-color: #3949ab;
                color: white;
                padding: 12px;
                text-align: left;
              }

              .sales-summary-table tbody tr {
                background-color: white;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
                border-radius: 8px;
              }

              .sales-summary-table td {
                padding: 12px;
                color: #333;
                font-size: 14px;
              }

              .sales-summary-table tfoot .total-row td {
                background-color: #e8eaf6;
                font-size: 16px;
                font-weight: bold;
                border-top: 2px solid #c5cae9;
                padding-top: 14px;
                padding-bottom: 14px;
              }

              .text-right {
                text-align: right;
              }

              .sales-summary-table tbody tr:nth-child(odd) {
                background-color: #ffffff;
              }

              .sales-summary-table tbody tr:nth-child(even) {
                background-color: #f0f0f0;
              }

              .sales-summary-table tbody tr {
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
              }

              @media print {
                  table {
                  page-break-inside: auto;
                }

                tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
                }

                thead {
                  display: table-header-group;
                }

                tfoot {
                  display: table-footer-group;
                }

                .printable {
                  page-break-inside: avoid;
                }

                .signature-container {
                  break-before: auto; /* Let the signature section stay on the same page if there's space */
                }
                .print-button {
                  display: none !important;
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Poppins', sans-serif;
                }

                .sales-summary-container {
                  width: 100%;
                  background: white !important;
                  color: black !important;
                }

                .sales-summary-container h2 {
                  font-size: 18pt;
                  margin-bottom: 10mm;
                }

                .date-range {
                  font-size: 12pt;
                  margin-bottom: 10mm;
                }

                .sales-summary-table {
                  width: 100%;
                  border-spacing: 0;
                  border-collapse: collapse;
                }

                .sales-summary-table thead th,
                .sales-summary-table td {
                  font-size: 10pt;
                  border: 1px solid #000;
                }

                .sales-summary-table thead th {
                  background-color: #ccc !important;
                  color: #000 !important;
                }

                .sales-summary-table tbody tr:nth-child(odd) {
                  background-color: #fff !important;
                }

                .sales-summary-table tbody tr:nth-child(even) {
                  background-color: #f2f2f2 !important;
                }

                .sales-summary-table tfoot td {
                  background-color: #e0e0e0 !important;
                  font-weight: bold;
                }

                @page {
                  size: 8.5in 11in; /* Short bond paper */
                  margin: 20mm;
                }
                
              }
            </style>
          </head>
          <body onload="window.print();window.close()">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    }
  }
  
  getSalesReport(){
    this.loading = true;
    this._paymentService.salesPaymentReportV1(
      this.dateFrom,
      this.dateTo,
      undefined,
      undefined,
      undefined,
    ).subscribe({
      next: (res) => {
        this.loading = false;
        this.dataSource = res.salesPaymentHeaderReports ?? [];
        this.totalSales = res.totalPaid ?? 0;
        this.totalAmount = res.totalAmount ?? 0;
        this.totalUnpaid = res.balance ?? 0;
        console.log(res);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    })
  }
}
