import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { LoginUserDto, UserAuthService } from 'src/app/services/nswag/nswag.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { IconTruckReturn } from 'angular-tabler-icons/icons';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-side-login',
  styleUrl: './side-login.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    DividerModule
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit{
  @Input() authentication = false;
  userName = '';
  saving = false;
  loginCounter = 0;
  constructor(
    private router: Router,
    private userAuth: UserAuthService,
    private authService: AuthService,
    private toastr: ToastrService,
    private _loading: LoadingService
  ) {}
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if(this.authentication){
      this.form.patchValue({uname: localStorage.getItem('userName') ?? ''});
      console.log(this.form.value);
      this.form.get('uname')?.disable();
    }
  }

  authenticate(){
    const MAX_TRIES = 5;
    this._loading.show();
    console.log(this.form.value);
    const logInDto = new LoginUserDto({
      userName: this.form.value.uname ?? '',
      password: this.form.value.password ?? ''
    });
    this.userAuth.authenticateUser(logInDto).subscribe({
      next: (res) => {
        this._loading.hide();
        if(!res.isSuccess){
          this.loginCounter++;
          this.toastr.error('You have ' + (MAX_TRIES - this.loginCounter) + ' attempts left', 'Error! ' + res.message);
          if(this.loginCounter >= MAX_TRIES){
            this.toastr.error('Maximum attempts reached. You are about to be logged out!', 'Error! ' + res.message);
            this.authService.onlogout();
          }
          return 
        }
        this.toastr.success('User Authenticated Successfully');
        return;
      },
      error: (err) => {
        this._loading.hide();
        this.toastr.error('Error! ' + err);
      }
    })
  }

  login() {
    this.saving = true;
  
    this.userAuth
      .login(this.form.value.uname ?? '', this.form.value.password ?? '')
      .subscribe({
        next: (res) => {
          this.saving = false;
  
          if (res.isSuccess) {
            // Store user data in localStorage
            localStorage.setItem('token', res.data.userToken ?? '');
            localStorage.setItem('userName', res.data.userName ?? '');
  
            // Get user roles and determine main route
            const userRoles = this.authService.getUserRoles();
  
            if (userRoles.length === 0) {
              this.toastr.error('No roles assigned to the user.');
              this.router.navigate(['/authentication/login']);
              return;
            }
  
            const redirectUrl = this.authService.getMainRouteForUser();
            this.router.navigateByUrl(redirectUrl);
  
            this.toastr.success('Login Successful');
          } else {
            this.toastr.error('Error! ' + res.message);
          }
        },
        error: (err) => {
          this.toastr.error('Error! ' + err.message);
          this.saving = false;
        },
      });
  }
}
