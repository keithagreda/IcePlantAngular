import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MaterialModule } from 'src/app/material.module';
import { AppSideLoginComponent } from "../../pages/authentication/side-login/side-login.component";
import { DialogModule } from 'primeng/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoginUserDto, UserAuthService } from 'src/app/services/nswag/nswag.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-authenticate-user',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    MaterialModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    AppSideLoginComponent,
    RouterModule,
        MatButtonModule,
],
  templateUrl: './authenticate-user.component.html',
  styleUrl: './authenticate-user.component.scss',
})
export class AuthenticateUserComponent {
  @Output() isAuthenticated = new EventEmitter<boolean>();
  visible = false;
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

  closeForm() {}

  form = new FormGroup({
      uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password: new FormControl('', [Validators.required]),
    });
  
    get f() {
      return this.form.controls;
    }
  
    ngOnInit(): void {
      this.form.patchValue({uname: localStorage.getItem('userName') ?? ''});
        this.form.get('uname')?.disable();
    }
  
    authenticate(){
      const MAX_TRIES = 5;
      this._loading.show();
      const logInDto = new LoginUserDto({
        userName: localStorage.getItem('userName') ?? '',
        password: this.form.value.password ?? ''
      });
      this.userAuth.authenticateUser(logInDto).subscribe({
        next: (res) => {
          this._loading.hide();
          if(!res.isSuccess){
            this.loginCounter++;
            this.toastr.error('You have ' + (MAX_TRIES - this.loginCounter) + ' attempts left', 'Error! ' + res.message);
            if(this.loginCounter >= MAX_TRIES){
              this.visible = false;
              this.toastr.error('Maximum attempts reached. You are about to be logged out!', 'Error! ' + res.message);
              this.authService.onlogout();
              this.isAuthenticated.emit(false);
            }
            return 
          }
          this.visible = false;
          this.isAuthenticated.emit(true);
          this.toastr.success('User Authenticated Successfully');
          return;
        },
        error: (err) => {
          this._loading.hide();
          this.toastr.error('Error! ' + err);
        }
      })
    }

}
