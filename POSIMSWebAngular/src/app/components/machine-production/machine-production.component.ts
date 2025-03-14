import { Component, Input, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { GetMachineGenerationV1Dto } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-machine-production',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './machine-production.component.html',
  styleUrl: './machine-production.component.scss',
})
export class MachineProductionComponent implements OnInit {
  @Input() data: GetMachineGenerationV1Dto = new GetMachineGenerationV1Dto();
  @Input() num = 0;
  series: ApexNonAxisChartSeries = [0.1, 0.1]; // Data values
  chart: ApexChart;
  labels = ['Good', 'Reject'];
  colors = ['#3cb043', '#ff6692'];
  responsive: ApexResponsive[] = [];

  dataLabels: ApexDataLabels = {
    enabled: false, // Disable data labels inside the pie
  };
  legend: ApexLegend = {
    show: false, // Hide legend labels
  };

  constructor() {}
  ngOnInit(): void {
    this.chart = {
      type: 'pie',
      width: '200px',
    };

    this.series = [this.data.good ?? 0.1, this.data.bad ?? 0.1];

    // this.responsive = [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: '100%',
    //       },
    //     },
    //   },
    // ];
  }
}
