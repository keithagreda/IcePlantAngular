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
    window.addEventListener('message', (event) => {
    if (event.data === 'printed') {
      this.logPrint();
    }
  });
  }

  initialize() {
    this.checkScreenSize();
    this.viewSales();
  }

  logPrint() {
    if(this.printTransNum == '') return;
    this._printLogService.createPrinterLogs(this.printTransNum).subscribe({
      next: (res) => {
      },
      error: (err) => {
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
    if (!transNum) return;
    this.printTransNum = transNum;
  
    const printElement = document.getElementById(divId);
    if (!printElement) {
      console.log('Element with id: ' + divId + ' not found');
      return;
    }
  
    const printContents = printElement.innerHTML;
  
    const styles = `
      <style>
        @import "src/assets/scss/_variables.scss";

        .sales-detail {
          border: solid 2px;
          padding: 0px !important;
        }

        .sales-card {
          width: 100%;
          border-radius: 7px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        @media print {
          .no-print {
            display: none !important;
          }

          // .sales-card {
          //   width: 360px !important;
          //   height: 300px !important;
          // }

        }

        .order-actions{
          display: flex;
          flex-direction: column;
          gap: .5rem;
        }




        .sales-header {
          display: flex;
          flex-direction: row;
          margin-bottom: 8px;
          background-color: $primary;
          justify-content: space-between;
          border-radius: 7px 7px 0px 0px;
          padding: 1rem 0.5rem;
          gap: .5rem;
        }

        .order-details{
          display: flex;
          flex-direction: column;
        }

        .sales-content {
          padding: 1rem 0.5rem;
          overflow-x: auto;
        }

        .s-header-title {
          margin: 0px;
          color: $white;
        }

        .custom-table {
          margin-bottom: 24px;
          width: 100%;
          border-collapse: collapse; /* Ensures a single border for the table */
          text-align: left;

          th {
            text-align: left;
          }

          thead {
            border-bottom: 2px solid #000;
          }

          th,
          td {
            padding: 10px;
          }
        }

        .sales-summary {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          overflow-x: auto;
        }

        .sold-by{
          display: flex;
          flex-direction: column-reverse;
        }

        .costs {
          display: flex;
          flex-direction: column;
          text-align: end;
        }

        .item {
          font-weight: bold;
        }

        .mobile {
          h3 {
            margin: 0px;
          }
          span {
            font-weight: bold;
          }

          .sales-item {
          }
        }

      </style>
    `;
  
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            ${styles}
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
            <script>
            window.onload = function() {
              window.print();
              window.close();
              window.opener.postMessage('printed', '*');
            };
          </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      console.error('Failed to open print window');
    }
  
    this.isPrint = false;
  }
  
}
