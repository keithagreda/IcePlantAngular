import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticateUserComponent } from 'src/app/components/authenticate-user/authenticate-user.component';
import { CreateOrEditStocksReceivingModalComponent } from 'src/app/components/create-or-edit-stocks-receiving-modal/create-or-edit-stocks-receiving-modal.component';
import { MaterialModule } from 'src/app/material.module';
import {
  GetAllStocksReceivingDto,
  StocksService,
} from 'src/app/services/nswag/nswag.service';
@Component({
  selector: 'app-stocks-receiving',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    CreateOrEditStocksReceivingModalComponent,
    AuthenticateUserComponent
  ],
  templateUrl: './stocks-receiving.component.html',
  styleUrl: './stocks-receiving.component.scss',
})
export class StocksReceivingComponent implements OnInit {
  @ViewChild(CreateOrEditStocksReceivingModalComponent)
  createOrEditStocksReceivingModalComponent!: CreateOrEditStocksReceivingModalComponent;
  @ViewChild(AuthenticateUserComponent)
    authenticateUserComponent!: AuthenticateUserComponent;
  stocksReceivings: GetAllStocksReceivingDto[] = [];
  displayedColumns1: string[] = [
    'transNum',
    'productName',
    'quantity',
    'storageLocation',
    'dateReceived',
    'action',
  ];
  constructor(private _stocksReceivingService: StocksService) {}
  ngOnInit(): void {
    this.getAllStocksReceiving();
  }

  getAllStocksReceiving() {
    this._stocksReceivingService.getReceiveStocks().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.stocksReceivings = res.data;
          console.log(res.data);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openAuthentication(){
    this.authenticateUserComponent.visible = true;

  }
  showCreateOrEditModal(event: boolean, id?: string) {
    this.createOrEditStocksReceivingModalComponent.show();
  }
}
