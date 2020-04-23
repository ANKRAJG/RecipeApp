import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  errorMsg: string = null;

  constructor(private authService: AuthenticationService,
              private router: Router) { }

  ngOnInit(): void {

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
