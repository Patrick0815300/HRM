import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/supabase/client.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router, private messageService: MessageService) {
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
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Erfolgreich eingeloggt', life: 2000 });
          setTimeout(() => {
            this.router.navigate(['/employeesManagement']);
          }, 2000);
        } else {

          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login fehlgeschlagen. Bitte überprüfe deine Eingaben.' });
        }
      } catch (error: any) {
        this.messageService.add({ severity: 'error', summary: error, detail: 'Ein unbekannter Fehler ist aufgetreten.' });
      }
    }
  }
}
