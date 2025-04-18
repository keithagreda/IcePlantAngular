import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';
import { DropdownModule } from 'primeng/dropdown';
import {
  CreateProductV1Dto,
  ProductCategoryDto,
  ProductCategoryDtoV1,
  ProductCategoryService,
  ProductService,
} from 'src/app/services/nswag/nswag.service';

@Component({
  selector: 'app-create-or-edit-product',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    MaterialModule,
    DropdownModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './create-or-edit-product.component.html',
  styleUrl: './create-or-edit-product.component.scss',
})
export class CreateOrEditProductComponent implements OnInit {
  @Output() modalSave = new EventEmitter<any>();
  productCategories: ProductCategoryDtoV1[] = [];
  createOrEditProduct: CreateProductV1Dto = new CreateProductV1Dto();
  createProductForm!: FormGroup;
  selectedCategory: ProductCategoryDtoV1 = new ProductCategoryDtoV1();
  visible = false;
  saving = false;
  constructor(
    private fb: FormBuilder,
    private _toastr: ToastrService,
    private _productService: ProductService,
    private _productCategoryService: ProductCategoryService
  ) {
    this.createProductForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      daysTillExpiration: ['', [Validators.required, Validators.min(1)]],
      productCategories: [[], [Validators.required]],
      // categories: this.fb.array([
      //   this.fb.group({ id: [null, Validators.required], name: [null] }),
      // ]),
    });
  }
  ngOnInit(): void {
    this.getCategory();
  }

  closeForm() {
    this.visible = false;
    this.createProductForm.reset();
  }

  show(id?: number) {
    this.visible = true;
    if (!id) {
      this.createOrEditProduct = new CreateProductV1Dto();
      return;
    }
    this._productService.getProductForEdit(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.createOrEditProduct = res.data;
          this.populateForm(this.createOrEditProduct);
        }
      },
      error: (err) => {
        this._toastr.error('Something went wrong. While retrieving product');
      },
    });
    // this.getProduct(id);
    //get product
  }

  get categories(): FormArray {
    return this.createProductForm.get('categories') as FormArray;
  }

  trackByCategoryId(index: number, item: any): number {
    return item.id;
  }

  addCategory() {
    (this.createProductForm.get('categories') as FormArray).push(
      this.fb.group({ id: [null, Validators.required], name: [null] })
    );
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index); // Remove category at specific index
  }

  getCategory() {
    this._productCategoryService.getProductCategory().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res.data);
          this.productCategories = res.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getProduct(id: number) {}

  populateForm(data: CreateProductV1Dto) {
    this.createProductForm.setValue({
      id: data.id,
      name: data.name,
      price: data.price,
      daysTillExpiration: data.daysTillExpiration,
      productCategories: data.productCategories,
    });
  }

  onSubmit() {
    this.saving = true;
    this._productService
      .createOrEditProduct(this.createProductForm.value)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this._toastr.success(res.data);
            this.modalSave.emit(null);
            this.closeForm();
          }
          if (!res.isSuccess) {
            this._toastr.error(res.message);
          }
          this.saving = false;
        },
        error: (err) => {
          this.saving = false;
          this._toastr.error('Something went wrong while creating product');
        },
      });
  }
}
