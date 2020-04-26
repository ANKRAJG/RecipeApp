import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/user/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMsg: string = null;
  private userSub: Subscription;

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
        if(user) {
          this.router.navigate(['/recipes']);
        }
    });
    this.initForm();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  initForm() {
    this.registerForm = new FormGroup({
      'email': new FormControl(null, Validators.required),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onRegister() {
    if(!this.registerForm.valid) {
      return;
    }
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    this.isLoading = true;
    this.authService.register(email, password).subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    }, errorMsg => {
      this.isLoading = false;
      this.errorMsg = errorMsg;
    });
  }

}
