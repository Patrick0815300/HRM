import { Component } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/supabase/client.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lastName: string = '';
  firstName: string = '';

  constructor(private clientService: ClientService, private router: Router) {
    this.getUser();
  }

  getUser() {
    this.clientService.getEmployeeDataByUserId().then(data => {
      this.firstName = data.first_name;
      this.lastName = data.last_name

    })
  }

  signOut() {
    this.clientService.signOut();
    this.router.navigate(['']);
  }

}
