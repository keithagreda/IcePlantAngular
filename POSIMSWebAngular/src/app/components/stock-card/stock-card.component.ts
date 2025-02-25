import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MaterialModule } from 'src/app/material.module';
import { GetStockCardDayDto, InventoryService } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [
    MaterialModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,
        ProgressSpinnerModule,
        MatDatepickerModule,
        MatInputModule,
        MatFormFieldModule,
        MatNativeDateModule,
        ReactiveFormsModule,
  ],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.scss'
})
export class StockCardComponent implements OnInit {
  displayedColumns: string[] = [
    'day',
    'begQty',
    'received',
    'sales',
  ];
  dataSource: GetStockCardDayDto[] = [];
  loading = false;

  constructor(
    private _inventoryService: InventoryService
  ) {
    
  }
  ngOnInit(): void {
    this.getStockCard();
  }

  getStockCard(){
    this._inventoryService.getStockCard(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ).subscribe({
      next: (res) =>{
        if(res.isSuccess){
          this.dataSource = res.data.items ?? [];
        }
      }
    })
  }
}
