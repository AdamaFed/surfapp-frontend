import {
    Component,
    inject,
    OnInit
} from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule
} from "@angular/forms";
import {
    LoginService
} from "../service/login.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
    loginService = inject(LoginService);
    newRegisterForm = this.formBuilder.group({
        username: '',
        password: ''
    });

    constructor(private formBuilder: FormBuilder, private router: Router) {
    }

    onSubmit() {
        this.loginService.register(
            this.newRegisterForm.value.username ?? '',
            this.newRegisterForm.value.password ?? ''
        ).subscribe(
            (result: any) => {
                if (result != null) {
                    this.router.navigate(['/login']);
                } else {
                    window.alert("User already exists");
                }
            }
        );
    }

    ngOnInit(): void {
    }
}
