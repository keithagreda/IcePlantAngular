import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MaterialModule } from 'src/app/material.module';
import { CustomerService, CustomerWithTransDto, PaymentDetailDto, PaymentService, TransPaymentDetail } from 'src/app/services/nswag/nswag.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-trans-table',
  standalone: true,
  imports: [
    DialogModule,
        MaterialModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        ButtonModule,
    TableModule, 
    CommonModule],
  templateUrl: './customer-trans-table.component.html',
  styleUrl: './customer-trans-table.component.scss'
})
export class CustomerTransTableComponent {
  customerId = '';
  expandedRows = {};
  customerTrans: CustomerWithTransDto[] = [];
  selectedTransDetails: TransPaymentDetail[] = []
  constructor(
    private _customerService: CustomerService, 
    private _paymentService: PaymentService,
    private _toastr: ToastrService) {
    
  }

  ngOnInit(): void {
    // this.getCustomers();
    
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.selectedTransDetails = [];
    this.getSelectedTrans(event.data.id);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.selectedTransDetails = [];
  }

payUnpaidTrans(paymentHeaderId: string) {
  Swal.fire({
    title: 'Enter Payment Amount',
    input: 'number',
    inputLabel: 'Payment Amount',
    inputPlaceholder: 'Enter the amount to pay',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    inputValidator: (value) => {
      if (!value || parseFloat(value) <= 0) {
        return 'Please enter a valid amount!';
      }
      return null;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const paymentAmount = parseFloat(result.value!);
      this.updatePayment(paymentHeaderId, paymentAmount);
      console.log('Payment Amount:', paymentAmount);

      // Call your payment service or handle the payment logic here
    }
  });
}

updatePayment(paymentHeaderId: string, amount: number){
  const dto = PaymentDetailDto.fromJS({
            paymentHeaderId: paymentHeaderId, 
            amountPaid: amount
          });

          this._paymentService.updatePayment(dto).subscribe({
            next: (res) => {
              if(res.isSuccess){
                this._toastr.success('Payment updated successfully!');
                this.getCustomerTrans();
              } else{
                this._toastr.error(res.message);
              }
            }, error: (err) => {
              this._toastr.error('An error occurred while updating payment!');
            }
          })
}
  showCustomerTrans(customerId: string) {
    this.customerId = customerId;
    this.getCustomerTrans();
  }


  getCustomerTrans() {
    this._customerService.getCustomerTrans(
      this.customerId,
      undefined,
      undefined,
      undefined
    ).subscribe({
      next: (res) => {
        this.customerTrans = res.data.items ?? [];
      },
      error: () => {

      }
    })
  }

  getSelectedTrans(paymentHeaderId: string){
    this._customerService.getTransactionPaymentHistory(paymentHeaderId, undefined, undefined, 
      undefined).subscribe({
      next: (res) => {
        this.selectedTransDetails = res.data ?? [];
      },
      error: () => {
        this._toastr.error('An error occurred while fetching transaction details!');
      }
    })
  }

  resetCustomerId(){{
    this.customerId = '';
  }}

}
