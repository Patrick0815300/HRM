import { Component } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/supabase/client.service';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../services/supabase/employees.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lastName: string = '';
  firstName: string = '';
  avatarPath?: string | null;
  avatarUrl?: string | null;

  constructor(private clientService: ClientService, private employeeService: EmployeesService, private router: Router) {
    this.getUser();
  }

  /**
   * Fetches and sets the current user's first and last name.
   *
   * Retrieves the employee data for the currently authenticated user and assigns
   * the first and last name to the corresponding class properties.
   *
   * @returns {void}
   */
  async getUser() {
    await this.employeeService.getEmployeeDataByUserId().then(data => {
      this.firstName = data.first_name;
      this.lastName = data.last_name;
      this.avatarPath = data.avatar_path;
    });
    this.getAvatarUrl();
  }

  /**
   * Signs out the current user and navigates to the home page.
   *
   * Calls the sign-out method from the authentication service and redirects the user
   * to the root route.
   *
   * @returns {void}
   */
  signOut() {
    this.clientService.signOut();
    this.router.navigate(['']);
  }


  async getAvatarUrl() {
    if (this.avatarPath) {
      const url = await this.employeeService.getAvatarUrl(this.avatarPath).then(data => {
        console.log('data: ' + data);
        this.avatarUrl = data;
      })
    } else { console.log('kein avatarPath vorhanden.'); }
  }
}
