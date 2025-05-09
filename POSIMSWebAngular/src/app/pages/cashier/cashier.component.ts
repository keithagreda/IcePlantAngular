import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { MaterialModule } from 'src/app/material.module';
import { CartService } from 'src/app/services/cart.service';
import {
  ApiException,
  CreateOrEditSalesV1Dto,
  CreateSalesDetailV1Dto,
  CustomerDropDownDto,
  CustomerService,
  GetProductDropDownTableV1Dto,
  NotificationService,
  ProductService,
  SalesPaymentDto,
  SalesService,
} from 'src/app/services/nswag/nswag.service';
import Swal from 'sweetalert2';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ViewSalesDetailsComponent } from 'src/app/components/view-sales-details/view-sales-details.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticateUserComponent } from '../../components/authenticate-user/authenticate-user.component';

@Component({
  selector: 'app-cashier',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    DialogModule,
    SidebarModule,
    AutoCompleteModule,
    ViewSalesDetailsComponent,
    AuthenticateUserComponent,
  ],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss',
})
export class CashierComponent implements OnInit {
  @ViewChild(ViewSalesDetailsComponent)
  viewSalesDetailsComponent!: ViewSalesDetailsComponent;
  @ViewChild(AuthenticateUserComponent)
  authenticateUserComponent!: AuthenticateUserComponent;
  sideBarVisible2 = false;
  saving = false;
  items: GetProductDropDownTableV1Dto[] = [];
  tempCartItem: CreateSalesDetailV1Dto[] = [];
  cartItem: CreateSalesDetailV1Dto[] = [];
  product: CreateSalesDetailV1Dto = new CreateSalesDetailV1Dto();
  selectedProduct: CreateSalesDetailV1Dto = new CreateSalesDetailV1Dto();
  visible = false;
  customerName = '';
  customerNames: string[] = [];
  filterCustomerName: string = '';
  totalAmount: number = 0; // Add a property to store the total amount
  partialPayment: number | null = null;

  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private _customerService: CustomerService,
    private _toastr: ToastrService,
    private _salesService: SalesService,
    private _notificationService: NotificationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCartItem();
    this.getCustomerNames();
  }

  getProducts() {
    this._productService.getProductDropDownTableV1(null, null, null).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.items = res.data.items ?? [];
        }
        if (!res.isSuccess) {
          this._toastr.error(res.message);
        }
      },
      error: (err) => {
        this._toastr.error(err);
      },
    });
  }

  getCustomerNames() {
    this._customerService
      .customerDropDown(this.filterCustomerName, null, null)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.customerNames = [];
            res.data.items?.map((item) => {
              this.customerNames.push(item.customerFullName ?? '');
            });
            console.log(this.customerNames);
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  filterCustomer(event: any) {
    this.filterCustomerName = event.query.toLowerCase();
    this.getCustomerNames();
  }

  onSelect(event: any){
    this.filterCustomerName = event.value.toLowerCase();
  }

  onCustomerSelect() {
    debugger;
    // Normalize the customer names and filterCustomerName by trimming spaces and converting to lowercase
    const normalizedCustomerNames = this.customerNames.map((name) =>
      name.toLowerCase().trim()
    );
    const normalizedFilterCustomerName = this.filterCustomerName.toLowerCase().trim();
  
    if (normalizedCustomerNames.includes(normalizedFilterCustomerName)) {
      // Find the original case-sensitive customer name
      const originalCustomerName = this.customerNames.find(
        (name) => name.toLowerCase().trim() === normalizedFilterCustomerName
      );
      this.customerName = originalCustomerName || this.filterCustomerName;
      this.saveTransaction();
    } else {
      Swal.fire({
        title: 'Customer not found',
        text: 'The selected customer does not exist. Would you like to create a new customer?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create',
        cancelButtonText: 'No, cancel',
        confirmButtonColor: '#635bff',
        cancelButtonColor: '#ff6692',
      }).then((result) => {
        if (!result.isConfirmed) {
          this.visible = false;
          this.sideBarVisible2 = false;
          this.customerName = '';
          this.filterCustomerName = '';
          this._toastr.error('Selected customer does not exist.');
        } else {
          this.saveTransaction();
        }
      });
    }
  }

  closeForm() {
    this.visible = false;
  }

  placeOrder() {
    this.saving = true;
    const cartData = localStorage.getItem('cart');

    if (!cartData) {
      console.error('Cart is empty');
      return;
    }

    // Parse JSON data
    const parsedCartData = JSON.parse(cartData);

    // Map parsed data to SalesDetail instances
    const createSalesDetailV1Dto = parsedCartData.map(
      (item: CreateSalesDetailV1Dto) => {
        const dto = CreateSalesDetailV1Dto.fromJS({
          productId: item.productId,
          actualSellingPrice: item.actualSellingPrice,
          quantity: item.quantity,
        });
        return dto;
      }
    );

    //if partial payment is not null the payment transaction is automatically
    //treated as credit while if its null it is treated as cash

    const payment = SalesPaymentDto.fromJS({
      saleType: this.partialPayment != null ? 1: 0,
      totalAmount: 0,
      amountPaid: this.partialPayment != null ? this.partialPayment: 0,
    })

    const salesDto = CreateOrEditSalesV1Dto.fromJS({
      salesHeaderId: null,
      customerName: this.customerName,
      createSalesDetailV1Dto: createSalesDetailV1Dto,
      salesPaymentDto: payment,
    });

    this._salesService.createSales(salesDto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          Swal.fire({
            title: 'Success!',
            text: 'Sales Transaction Saved!',
            icon: 'success',
          });
          this._cartService.clearCart();
          this.getProducts();
          this._notificationService
            .sendMessageToAdmin('A new sale has been made.')
            .subscribe({
              next: (res) => {
                console.log(res);
              },
              error: (err) => {
                console.error(err);
              },
            });
          this.viewSalesDetailsComponent.initialize();
        }

        if(!res.isSuccess){
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
          });
        }
        this.visible = false;
        this.sideBarVisible2 = false;
        this.getCustomerNames();
        this.saving = false;
        this.partialPayment = null;
      },
      error: (err) => {
        this.saving = false;
        console.error(err); // Log error for debugging
        this.partialPayment = null;
      },
    });
  }

  setPartialPaymentToNull(){
    this.partialPayment = null;
  }

  saveTransaction() {
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        
        this.placeOrder();
      }
    });
  }

  openAuthentication() {
    this.authenticateUserComponent.visible = true;
  }

  insertCustomer(event: boolean) {
    this.visible = true;
  }

  getCartItem() {
    this.cartItem = this._cartService.getCart();
    //if it has value trigger update cart
    if (this.cartItem.length > 0) {
      this.updateCartPrices();
    }
    this.calculateTotalAmount(); // Calculate the total amount whenever the cart items are fetched
  }

  updateCartPrices() {
    this._productService.getProductDetailsForCart(this.cartItem).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.cartItem = res.data;
          this.calculateTotalAmount(); // Recalculate the total amount after updating cart prices
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  calculateTotalAmount() {
    this.totalAmount = this.cartItem.reduce((total, item) => {
      return total + (item.productPrice ?? 0);
    }, 0);
  }

  showControl(
    selectedItem: GetProductDropDownTableV1Dto,
    items: GetProductDropDownTableV1Dto[]
  ) {
    if (selectedItem.showControl) {
      return;
    }
    this.selectedProduct = new CreateSalesDetailV1Dto();
    this.selectedProduct.productId = selectedItem.id ?? 0;
    this.selectedProduct.productName = selectedItem.name;
    this.selectedProduct.quantity = 1;
    this.selectedProduct.productPrice = selectedItem.price;
    items.forEach((item) => {
      item.showControl = item === selectedItem ? !item.showControl : false;
    });
  }

  addQuantity(product: GetProductDropDownTableV1Dto) {
    this.selectedProduct.productId = product.id ?? 0;
    this.selectedProduct.quantity = (this.selectedProduct.quantity || 0) + 1;
    this.selectedProduct.productName = product.name;
    this.selectedProduct.productPrice = product.price;

    // this._cartService.addToCart(addToCartDto);
    // this.getCartItem();
  }
  minusQuantity(product: GetProductDropDownTableV1Dto) {
    if ((this.selectedProduct.quantity || 0) <= 1) return;
    this.selectedProduct.productId = product.id ?? 0;
    this.selectedProduct.quantity = (this.selectedProduct.quantity || 0) - 1;
    this.selectedProduct.productName = product.name;
    this.selectedProduct.productPrice = product.price;
  }

  showDialog() {
    this.sideBarVisible2 = true;
    this.getCartItem();
  }

  actualSellingPriceHandler(item: CreateSalesDetailV1Dto) {
    this._cartService.actualSellingPriceHandler(
      item.productId,
      item.actualSellingPrice ?? 0
    );
  }

  addToCart(item: GetProductDropDownTableV1Dto) {
    this.showDialog();
    this._cartService.addToCart(this.selectedProduct);
    item.showControl = false;
    this.selectedProduct = new CreateSalesDetailV1Dto();
    this.getCartItem();
  }

  cartQuantityHandler(productId: number, operator: number) {
    this._cartService.productQuantityHandler(productId, operator);
    this.getCartItem();
  }

  removeItem(productId: number) {
    this._cartService.removeFromCart(productId);
    this.getCartItem();
  }
}
