import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../../services/supabase/employees.service';
import { Employee } from '../../../shared/models/employee.model';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ProfileComponent } from './tabs/profile/profile.component';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-empoyees-page',
  imports: [
    TabsModule,
    ProfileComponent,
    CommonModule,
    ProgressSpinnerModule,
    MatIconModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './empoyees-page.component.html',
  styleUrl: './empoyees-page.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class EmpoyeesPageComponent implements OnInit {
  employee!: Employee;
  id: string = '';
  role: string = 'admin';
  avatarUrl?: string;

  tabs: { title: string; value: number; content: string }[] = [];
  selectedTab: number = 0;

  constructor(private emploeesService: EmployeesService, private route: ActivatedRoute, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.employee = await this.emploeesService.getEmployeesDataById(this.id);
    this.getAvatarUrl();
  }

  async getAvatarUrl() {
    if (this.employee.avatarPath) {
      const url = await this.emploeesService.getAvatarUrl(this.employee.avatarPath).then(data => {
        this.avatarUrl = data!;
      })
    }
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });

      },
    });
  }



}
