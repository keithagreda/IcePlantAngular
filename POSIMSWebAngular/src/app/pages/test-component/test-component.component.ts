import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CartService } from 'src/app/services/cart.service';
import { SidebarModule } from 'primeng/sidebar';
import {
  CreateOrEditSalesV1Dto,
  CreateSalesDetailV1Dto,
  CurrentInventoryDto,
  EntityHistoryDto,
  EntityHistoryService,
  GetProductDropDownTableDto,
  ProductService,
  SalesService,
  ViewSalesHeaderDto,
} from 'src/app/services/nswag/nswag.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ChartModule } from 'primeng/chart';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MonthlySalesChart } from 'src/app/components/monthly-sales-chart/monthly-sales-chart.component';

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    DialogModule,
    SidebarModule,
    NgApexchartsModule,
  ],
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.scss',
})
export class TestComponentComponent implements OnInit {
  displayedColumns: string[] = [
    'entityname',
    'action',
    'changes',
    'changeTime',
    'changedBy',
  ];
  loading = false;
  dataSource: EntityHistoryDto[] = [];
  filterText = '';
  isMobile = false;
  viewSalesHeaderDto: ViewSalesHeaderDto[] = [];
  public totalincomeChart!: Partial<MonthlySalesChart> | any;

  series: ApexNonAxisChartSeries = [44, 55]; // Data values
  chart: ApexChart = {
    type: 'pie',
    width: 380,
  };
  labels = ['Good', 'Bad']; // Labels for each slice
  responsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ];
  legend: ApexLegend = {
    position: 'right',
  };

  dataLabels: ApexDataLabels = {
    style: {
      colors: ['#FFFFFF'], // Change data label colors inside the pie chart
    },
  };
  data: any;

  options: any;
  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private _toastr: ToastrService,
    private _salesService: SalesService,
    private _entityHistoryService: EntityHistoryService
  ) {}
  ngOnInit(): void {
    this.constructChart();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    // this.getEntityHistory();
    this.viewSales();
    this.checkScreenSize();
  }

  getEntityHistory() {
    this._entityHistoryService
      .getAllEntityHistory(this.filterText, null, null)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.dataSource = res.data.items ?? [];
            console.log(this.dataSource);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize(); // Check screen size on resize
  }

  checkScreenSize(): void {
    this.isMobile = window.matchMedia('(max-width: 410px)').matches;
    console.log(this.isMobile);
  }

  viewSales() {
    this._salesService.viewSales(null, this.filterText, null, null).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res.data);
          this.viewSalesHeaderDto = res.data.items ?? [];
        }
      },
      error: (err) => {},
    });
  }

  constructChart() {
    this.totalincomeChart = {
      series: [
        {
          name: 'Income',
          color: '#3cb043',
          data: [50, 50],
        },
      ],
      chart: {
        type: 'donut',
        height: 350,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
      },
      legend: {
        show: true,
        position: 'bottom',
      },

      tooltip: {
        theme: 'dark',
        fixed: {
          enabled: true,
          position: 'right',
        },
      },
    };
  }
}
