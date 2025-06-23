import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/supabase/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const response = await this.clientService.signInWithEmail(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        // Prüfe, ob der Login wirklich erfolgreich war
        if (response && response.session && response.user) {
          this.router.navigate(['/employeesManagement']);
        } else {
          console.log('error');

          // Optional: Fehler anzeigen, falls keine Session/User zurückkommt
          //this.errorMessage = 'Login fehlgeschlagen. Bitte überprüfe deine Eingaben.';
        }
      } catch (error) {
        console.log('erster error');

        // Fehler abfangen und anzeigen
        //this.errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten.';
      }
    }
  }

}
