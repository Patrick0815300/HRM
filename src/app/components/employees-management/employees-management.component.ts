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
import { ContractType, Employee, EmployeeRole, EmployeeStatus, EmploymentType } from '../../shared/models/employee.model';
import { Table } from '../../shared/models/table.model';
import { ChipModule } from 'primeng/chip';
import { Router } from '@angular/router';
import { EmployeesService } from '../../services/supabase/employees.service';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-employees-management',
  imports: [TableModule, CommonModule, InputTextModule, TagModule,
    SelectModule, SelectModule, ButtonModule, IconFieldModule, InputIconModule,
    ChipModule, MatIconModule, DialogModule, FloatLabel, DatePicker, FormsModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './employees-management.component.html',
  styleUrl: './employees-management.component.scss'
})
export class EmployeesManagementComponent implements OnInit {
  employees!: Employee[];
  role: string = '';
  columns: Table[] = [];
  visibleAddEmployeeDialog: boolean = false;
  statusOptions!: { label: string; value: EmployeeStatus }[];
  contractTypes!: { label: string; value: ContractType }[];
  employmentType!: { label: string; value: EmploymentType }[];
  now = new Date().toISOString();
  privateEmail: string = '';
  avatarUrl?: string | any;

  employee: Employee = {
    firstName: '',
    lastName: '',
    workEmail: '',
    jobTitle: '',
    startDate: '',
    status: 'active',
    employmentType: 'full_time',
    contractType: 'permanent',
    createdAt: this.now,
    updatedAt: this.now,
    role: EmployeeRole.Employee,
  };

  private readonly allColumns: Table[] = [
    { field: 'avatarPath', header: 'Avatar', width: '64px', sortable: false },
    { field: 'lastName', header: 'Name', sortable: true },
    { field: 'jobTitle', header: 'Job', sortable: false },
    { field: 'departmentName', header: 'Team', sortable: true },
    { field: 'workEmail', header: 'Mail', roles: ['hr_manager', 'manager', 'admin'], sortable: false },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'startDate', header: 'Start', sortable: true },
    { field: 'contractType', header: 'Vertragstyp', roles: ['hr_manager', 'admin'], sortable: false },
    { field: 'weeklyHours', header: 'h/Woche', roles: ['hr_manager', 'admin'], sortable: true },
    { field: 'salaryBand', header: 'Band', roles: ['hr_manager', 'admin'], sortable: true },
    { field: 'remainingPto', header: 'rest EU', roles: ['hr_manager', 'manager', 'admin'], sortable: false },
    { field: 'phone', header: 'Phone', roles: ['manager', 'admin'], sortable: false },
    { field: 'nextReviewDate', header: 'next Review', roles: ['manager', 'admin'], sortable: false },
    { field: 'actions', header: '', width: '56px', sortable: false }   // View / Edit / Delete
  ];

  constructor(public router: Router, private employeesService: EmployeesService, private messageService: MessageService) { }

  async ngOnInit(): Promise<void> {
    this.employees = await this.employeesService.getAllEmployeesData();
    this.role = await this.employeesService.getEmployeesRoleByUserId();
    this.columns = this.allColumns.filter(
      col => !col.roles || col.roles.includes(this.role)
    );
    this.getAvatarUrl();

    this.statusOptions = [
      { label: 'Active', value: 'active' },
      { label: 'On Leave', value: 'on_leave' },
      { label: 'Terminated', value: 'terminated' }
    ];

    this.contractTypes = [
      { label: 'Permanent', value: 'permanent' },
      { label: 'Fixed', value: 'fixed_term' },
      { label: 'Intership', value: 'internship' },
      { label: 'Temporary', value: 'temporary' }
    ];

    this.employmentType = [
      { label: 'Vollzeit', value: 'full_time' },
      { label: 'Teilzeit', value: 'part_time' },
    ];
  }

  // getUser() {
  //   this.employeesService.getEmployeeDataByUserId().then(data => {
  //     console.log(data);
  //   })
  // }

  addUser(email: string, employee: Employee) {
    this.employeesService.addUser(email, employee);
  }

  onStartDateChange(date: Date) {
    this.employee.startDate = date ? date.toISOString().substring(0, 10) : '';
  }

  async onSaveEmployee() {
    this.employee.workEmail = this.generateWorkEmail(this.employee.firstName, this.employee.lastName);
    try {
      await this.employeesService.createUserAndEmployee(this.privateEmail, this.employee);
      this.messageService.add({
        severity: 'success',
        summary: 'Erfolg',
        detail: 'Mitarbeiter und Benutzer wurden erfolgreich angelegt!'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: error?.message || 'Es ist ein Fehler aufgetreten.'
      });
    }
  }

  generateWorkEmail(firstName: string, lastName: string): string {
    const clean = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z]/g, '');

    return `${clean(firstName)}${clean(lastName)}@hrmsystem.de`;
  }


  showDialog() {
    this.visibleAddEmployeeDialog = true;
  }

  fullName(e: Employee) {
    return `${e.lastName}, ${e.firstName}`;
  }

  onRowClick(id: number) {
    // nur bei <=768px weiterleiten
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.router.navigate(['/employeesPage', id]);
    }
  }

  async getAvatarUrl() {
    const url = await this.employees.map(employee => {
      if (employee.avatarPath) {
        this.employeesService.getAvatarUrl(employee.avatarPath).then(data => {
          employee.avatarUrl = data !== null ? data : undefined;
        })
      }
    })
  }

}
