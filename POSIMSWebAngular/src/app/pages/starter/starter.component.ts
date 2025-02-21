import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppNewCustomersComponent } from 'src/app/components/new-customers/new-customers.component';
import { AppTotalIncomeComponent } from 'src/app/components/total-income/total-income.component';
import { AppDailyActivitiesComponent } from 'src/app/components/daily-activities/daily-activities.component';
import { AppBlogCardsComponent } from 'src/app/components/blog-card/blog-card.component';
import { AppRevenueProductComponent } from 'src/app/components/revenue-product/revenue-product.component';
import { AppRevenueForecastComponent } from 'src/app/components/revenue-forecast/revenue-forecast.component';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { MonthlySalesChartComponent } from 'src/app/components/monthly-sales-chart/monthly-sales-chart.component';
import { CurrentStocksComponent } from '../../components/current-stocks/current-stocks.component';
import { StocksGenerationComponent } from 'src/app/components/stocks-generation/stocks-generation.component';
import { COLORS } from 'src/assets/color';
import { MachineProductionComponent } from 'src/app/components/machine-production/machine-production.component';
import { ApexNonAxisChartSeries } from 'ng-apexcharts';
import {
  GetMachineGenerationV1Dto,
  GetMachineGenerationWTotal,
  MachineProductionService,
} from 'src/app/services/nswag/nswag.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppNewCustomersComponent,
    AppTotalIncomeComponent,
    AppDailyActivitiesComponent,
    AppBlogCardsComponent,
    AppRevenueProductComponent,
    AppRevenueForecastComponent,
    MonthlySalesChartComponent,
    DialogModule,
    CurrentStocksComponent,
    StocksGenerationComponent,
    MachineProductionComponent,
    CommonModule,
  ],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {
  visible = false;
  colors = COLORS;
  getMachineGenerationDto: GetMachineGenerationWTotal =
    new GetMachineGenerationWTotal();
  constructor(
    private _toastr: ToastrService,
    private _machineProductionService: MachineProductionService
  ) {
    // this._toastr.success('yow');
  }
  ngOnInit(): void {
    this.getAllMachineGeneration();
  }

  onShow() {
    this.visible = true;
  }

  getAllMachineGeneration() {
    this._machineProductionService
      .getAllMachineGeneration(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      )
      .subscribe({
        next: (res) => {
          this.getMachineGenerationDto = res.data;
        },
        error: (err) => {
          this._toastr.error(err);
        },
      });
  }
}
