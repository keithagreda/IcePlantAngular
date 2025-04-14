import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from 'src/app/material.module';
import {
  CreateStocksReceivingDto,
  GetMachineForDropDown,
  GetProductDropDownTableDto,
  GetStorageLocationForDropDownDto,
  MachineService,
  NotificationService,
  ProductService,
  StocksService,
  StorageLocationService,
} from 'src/app/services/nswag/nswag.service';
import { ToastrService } from 'ngx-toastr';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-create-or-edit-stocks-receiving-modal',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    MaterialModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
  ],
  templateUrl: './create-or-edit-stocks-receiving-modal.component.html',
  styleUrl: './create-or-edit-stocks-receiving-modal.component.scss',
})
export class CreateOrEditStocksReceivingModalComponent implements OnInit {
  @Output() modalSave = new EventEmitter<any>();
  form: FormGroup;
  products: GetProductDropDownTableDto[] = [];
  storageLocations: GetStorageLocationForDropDownDto[] = [];
  machines: GetMachineForDropDown[] = [];
  title = '';

  filterTextProduct = '';
  filteredProduct: GetProductDropDownTableDto[] = [];
  visible = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _stocksReceivingService: StocksService,
    private _productService: ProductService,
    private _storageLocationService: StorageLocationService,
    private _machineService: MachineService,
    private _lodingService: LoadingService,
    private _notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      selectedProduct: [null, Validators.required],
      quantity: [null, Validators.required],
      selectedStorageLocation: [null, Validators.required],
      selectedMachine: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getStorageLocation();
    this.getMachine();
  }

  closeForm() {
    this.visible = false;
  }

  show() {
    this.visible = true;
  }

  getProducts() {
    this._productService
      .getProductDropDownTable(this.filterTextProduct, null, null)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.products = res.data.items ?? [];
            console.log(this.products);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  filterProduct(event: any) {
    this.filterTextProduct = event.query.toLowerCase() ?? '';
    this.getProducts();
  }

  onProductSelect() {
    this.filterTextProduct =
      this.form.get('selectedProduct')?.value != null
        ? this.form.get('selectedProduct')?.value.name!
        : '';
  }

  getStorageLocation() {
    this._storageLocationService.getAllStorageLocation().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.storageLocations = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getMachine() {
    this._machineService
      .getMachineForDropdown(undefined, undefined, undefined)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.machines = res.data.items || [];
          }
          if (!res.isSuccess) {
            this._toastr.error(
              'Something went wrong while trying to retrieve machines dropdown'
            );
          }
        },
        error: (err) => {
          this._toastr.error(err);
        },
      });
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    this._lodingService.show();
    this.saving = true;
    const formValue = this.form.value;
    const createOrEditReceiveStocks: CreateStocksReceivingDto =
      new CreateStocksReceivingDto();
    createOrEditReceiveStocks.productId = formValue.selectedProduct.id;
    createOrEditReceiveStocks.quantity = formValue.quantity;
    createOrEditReceiveStocks.storageLocationId =
      formValue.selectedStorageLocation.id;
    createOrEditReceiveStocks.machineId = formValue.selectedMachine.id;

    this._stocksReceivingService
      .receiveStocks(createOrEditReceiveStocks)
      .subscribe({
        next: (res) => {
          this._lodingService.hide();
          if (res.isSuccess) {
            this._toastr.success('Stocks receiving created successfully');
            
            this.closeForm();
            this._notificationService
              .sendMessageToAdmin('A harvest has been successfully recorded.')
              .subscribe({
                next: (res) => {
                  console.log(res);
                },
                error: (err) => {
                  console.error(err);
                },
              });
            this.modalSave.emit(null);
          }
          this.saving = false;
        },
        error: (err) => {
          this._lodingService.hide();
          this.saving = false;
          this._toastr.error(
            'Something went wrong. While creating stocks receiving'
          );
        },
      });
  }
}
