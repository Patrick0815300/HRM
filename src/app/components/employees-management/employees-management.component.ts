import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ProgressBar } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { Employee } from '../../shared/models/employee.model';
import { Table } from '../../shared/models/table.model';
import { ChipModule } from 'primeng/chip';
import { Router } from '@angular/router';
import { EmployeesService } from '../../services/supabase/employees.service';


@Component({
  selector: 'app-employees-management',
  imports: [TableModule, CommonModule, InputTextModule, TagModule,
    SelectModule, SelectModule, ButtonModule, IconFieldModule, InputIconModule,
    ChipModule
  ],
  templateUrl: './employees-management.component.html',
  styleUrl: './employees-management.component.scss'
})
export class EmployeesManagementComponent implements OnInit {
  employees!: Employee[];
  role: string = '';

  columns: Table[] = [];

  private readonly allColumns: Table[] = [
    { field: 'avatarUrl', header: 'Avatar', width: '64px' },
    { field: 'lastName', header: 'Name' },
    { field: 'jobTitle', header: 'Job' },
    { field: 'departmentName', header: 'Team' },
    { field: 'workEmail', header: 'Mail', roles: ['hr_manager', 'manager', 'admin'] },
    { field: 'status', header: 'Status' },
    { field: 'startDate', header: 'Start' },
    { field: 'contractType', header: 'Vertragstyp', roles: ['hr_manager', 'admin'] },
    { field: 'weeklyHours', header: 'h/Woche', roles: ['hr_manager', 'admin'] },
    { field: 'salaryBand', header: 'Band', roles: ['hr_manager', 'admin'] },
    { field: 'remainingPto', header: 'rest EU', roles: ['hr_manager', 'manager'] },
    { field: 'phone', header: 'Phone', roles: ['manager'] },
    { field: 'nextReviewDate', header: 'next Review', roles: ['manager'] },
    { field: 'actions', header: '', width: '56px' }   // View / Edit / Delete
  ];

  constructor(public router: Router, private employeesService: EmployeesService) { }

  async ngOnInit(): Promise<void> {
    this.employees = await this.employeesService.getAllEmployeesData();
    this.columns = this.allColumns.filter(
      col => !col.roles || col.roles.includes(this.role)
    );
  }

  fullName(e: Employee) {
    return `${e.lastName}, ${e.firstName}`;
  }




}
