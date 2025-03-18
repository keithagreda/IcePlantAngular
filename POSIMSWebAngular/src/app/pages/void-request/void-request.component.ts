import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AuthenticateUserComponent } from 'src/app/components/authenticate-user/authenticate-user.component';
import { CreateOrEditStocksReceivingModalComponent } from 'src/app/components/create-or-edit-stocks-receiving-modal/create-or-edit-stocks-receiving-modal.component';
import { MaterialModule } from 'src/app/material.module';
import {
  GetAllStocksReceivingDto,
  GetVoidRequest,
  StocksService,
  VoidRequestService,
  VoidRequestStatus,
} from 'src/app/services/nswag/nswag.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-void-request',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    // CreateOrEditStocksReceivingModalComponent,
    // AuthenticateUserComponent
  ],
  templateUrl: './void-request.component.html',
  styleUrl: './void-request.component.scss',
})
export class VoidRequestComponent implements OnInit {
  // @ViewChild(CreateOrEditStocksReceivingModalComponent)
  // createOrEditStocksReceivingModalComponent!: CreateOrEditStocksReceivingModalComponent;
  // @ViewChild(AuthenticateUserComponent)
  //   authenticateUserComponent!: AuthenticateUserComponent;
  voidRequest: GetVoidRequest[] = [];
  displayedColumns1: string[] = [
    'transNum',
    'requestedBy',
    'status',
    'approver',
    'dateRequested',
    'action',
  ];
  totalRecords = 0;
  status = VoidRequestStatus;
  constructor(private _voidRequestService: VoidRequestService,
    private _toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getVoidRequest();
  }

  getVoidRequest(event?: PageEvent) {
    const currentPage = event?.pageIndex ?? 0;
      const pageSize = event?.pageSize ?? 5;
    this._voidRequestService.getVoidRequest(
      undefined,
      currentPage + 1, pageSize
    ).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.voidRequest = res.data.items ?? [];
          this.totalRecords = res.data.totalCount ?? 0;
          console.log(res.data);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateVoidRequest(voidRequestid: string, status: VoidRequestStatus) {
    Swal.fire({
              title: 'Are you sure?',
              text: "You are about to request a void for this transaction",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#635bff',
              cancelButtonColor: '#ff6692',
              confirmButtonText: 'Confirm',
              customClass: {
                popup: 'custom-swal-popup',
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this._voidRequestService.updateVoidRequest(voidRequestid, status).subscribe({
                  next: (res) =>{
                    if(res.isSuccess){
                      this._toastr.success(res.message);
                      return;
                    }
                    this._toastr.error(res.message);
                    return;
                  },
                  error: (err) => {
                    this._toastr.error(err);
                  }
                })
              }
            });
    
  }

  

  // openAuthentication(){
  //   this.authenticateUserComponent.visible = true;

  // }
  // showCreateOrEditModal(event: boolean, id?: string) {
  //   this.createOrEditStocksReceivingModalComponent.show();
  // }
}
