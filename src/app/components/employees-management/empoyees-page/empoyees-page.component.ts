import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../../../services/supabase/employees.service';
import { Employee } from '../../../shared/models/employee.model';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ProfileComponent } from './tabs/profile/profile.component';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-empoyees-page',
  imports: [
    TabsModule,
    ProfileComponent,
    CommonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './empoyees-page.component.html',
  styleUrl: './empoyees-page.component.scss'
})
export class EmpoyeesPageComponent implements OnInit {
  employee!: Employee;
  id: string = '';
  role: string = 'admin';

  tabs: { title: string; value: number; content: string }[] = [];
  selectedTab: number = 0;

  constructor(private emploeesService: EmployeesService, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.employee = await this.emploeesService.getEmployeesDataById(this.id);
  }



}
