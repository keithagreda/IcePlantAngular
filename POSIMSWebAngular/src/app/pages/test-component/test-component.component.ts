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
import { MachineProductionComponent } from 'src/app/components/machine-production/machine-production.component';
import { COLORS } from 'src/assets/color';
import { AppSideLoginComponent } from '../authentication/side-login/side-login.component';

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
    MachineProductionComponent,
    AppSideLoginComponent
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
  colors = COLORS;
  public totalincomeChart!: Partial<MonthlySalesChart> | any;

  data1: ApexNonAxisChartSeries = [20, 80];
  data2: ApexNonAxisChartSeries = [60, 40];

  data: any;

  options: any;
  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private _toastr: ToastrService,
    private _salesService: SalesService,
    private _entityHistoryService: EntityHistoryService
  ) {}
  ngOnInit(): void {}
}
