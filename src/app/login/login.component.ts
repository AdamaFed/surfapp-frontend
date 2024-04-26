import {Component, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule, Validators
} from "@angular/forms";
import {LoginService} from "../service/login.service";
import {Router} from "@angular/router";
import {
    BrowserModule
} from "@angular/platform-browser";
import {NavbarComponent} from "../navbar/navbar.component";

interface LoginFormValues {
    username: string;
    password: string;
}


@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginService = inject(LoginService);
  newLoginForm = this.formBuilder.group({
    username: '',
    password: ''
  });




  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  // onSubmit() {
  //   console.log(this.loginService.login(
  //     this.newLoginForm.value.username ?? '',
  //     this.newLoginForm.value.password ?? ''));
  //   this.newLoginForm.reset();
  //
  // }

    onSubmit() {
        this.loginService.login(
            this.newLoginForm.value.username ?? '',
            this.newLoginForm.value.password ?? ''
        ).subscribe(
            (result: any) => {
                if (result) {
                    localStorage.setItem('username', result.username);
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('roles', result.roles);

                    this.router.navigate(['']);
                }
                this.newLoginForm.reset();
            },
            (error) => {
                console.error('Login failed', error);
            }
        );
    }

  ngOnInit(): void {
  }


}






