import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/user/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
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
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogin(form: NgForm) { 
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    this.authService.login(email, password).subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    }, errorMsg => {
      this.isLoading = false;
      this.errorMsg = errorMsg;
    });
  }

}
