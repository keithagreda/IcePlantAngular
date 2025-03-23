import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from 'src/app/material.module';
import {
  PrinterLogsService,
  SalesService,
  ViewSalesHeaderDto,
} from 'src/app/services/nswag/nswag.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-sales-details',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    MaterialModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  templateUrl: './view-sales-details.component.html',
  styleUrls: ['./view-sales-details.component.scss'],
})
export class ViewSalesDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<ViewSalesHeaderDto>([]);
  visible = false;
  loading = false;
  filterText = '';
  isMobile = false;
  isPrint = false;
  viewSalesHeaderDto: ViewSalesHeaderDto[] = [];
  totalRecords = 0;
  pageSize = 5;
  currentPage = 0;
  printTransNum = '';

  constructor(private _salesService: SalesService, 
    private _printLogService: PrinterLogsService) {}

  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event: Event) {
    this.logPrint();
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.checkScreenSize();
    this.viewSales();
  }

  logPrint() {
    if(this.printTransNum == '') return;
    this._printLogService.createPrinterLogs(this.printTransNum).subscribe({
      next: (res) => {
        console.log(res);
        window.location.reload();

      },
      error: (err) => {
        console.error(err);
        window.location.reload();
      },
    })
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize(); // Check screen size on resize
  }

  checkScreenSize(): void {
    this.isMobile = window.matchMedia('(max-width: 410px)').matches;
    console.log(this.isMobile);
  }

  viewSales(event?: PageEvent) {
    const currentPage = event?.pageIndex ?? 0;
    const pageSize = event?.pageSize ?? 5;
    this._salesService
      .viewSales(true, null, this.filterText, currentPage + 1, pageSize)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            console.log(res.data);
            this.viewSalesHeaderDto = res.data.items ?? [];
            this.dataSource.data = this.viewSalesHeaderDto;
            this.totalRecords = res.data.totalCount ?? 0;
          }
        },
        error: (err) => {},
      });
  }

  checkPrintLogsHistory(transNum?: string) {
    if (!transNum) return;

    this._printLogService.getPrinterLogs(transNum).subscribe({
      next: (res) => {
        const printCount = res.data; // Assuming res.data contains the print count
        Swal.fire({
          title: 'Print Count',
          text: `This item has been printed ${printCount} times.`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch print count.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  show() {
    this.visible = true;
  }

  closeForm() { 
    this.visible = false;
  }

  printDiv(divId: string, transNum?: string) {
    if(transNum == undefined) return;
    if(transNum == '') return;
    this.printTransNum = transNum;
    const printElement = document.getElementById(divId);
    if (!printElement) {
      console.log('Element with id: ' + divId + ' not found');
      return;
    }
    const printContents = printElement.innerHTML;
    const originalContents = document.body.innerHTML;

    const styles = `
    <style>
      .sales-card {
        width: 360px;
        height: 300px;
        margin: 0 auto;
      }
    </style>
  `;

    document.body.innerHTML = `
    <html>
      <head>
        <title>Print</title>
        ${styles}
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `;
    window.print();
    this.isPrint = false;
    document.body.innerHTML = originalContents;
  }
}
