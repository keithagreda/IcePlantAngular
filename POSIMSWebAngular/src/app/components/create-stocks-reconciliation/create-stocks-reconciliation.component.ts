import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from 'src/app/material.module';
import { LoadingService } from 'src/app/services/loading.service';
import { CreateOrEditStocksReconciliationDto } from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-create-stocks-reconciliation',
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
  templateUrl: './create-stocks-reconciliation.component.html',
  styleUrl: './create-stocks-reconciliation.component.scss',
})
export class CreateStocksReconciliationComponent implements OnInit {
  @Output() modalSave = new EventEmitter<any>();
  form: FormGroup;
  active = false;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _lodingService: LoadingService
  ) {
    this.form = this.fb.group({
      selectedProduct: [null, Validators.required],
      quantity: [null, Validators.required],
      remarks: [null, Validators.required],
    });
  }
  ngOnInit(): void {}

  show() {
    this.active = true;
  }

  save() {}

  closeForm() {
    this.active = false;
  }
}
