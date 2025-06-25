import { Component, Input, OnInit } from '@angular/core';
import { ContractType, Employee, EmployeeStatus, EmploymentType, SalaryBand } from '../../../../../shared/models/employee.model';
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MatIconModule } from '@angular/material/icon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { EmployeesService } from '../../../../../services/supabase/employees.service';

@Component({
  selector: 'app-profile',
  imports: [
    FieldsetModule,
    CommonModule,
    AvatarModule,
    MatIconModule,
    TagModule,
    ButtonModule,
    FileUploadModule,
    ToastModule,
    HttpClientModule,
    InputTextModule,
    FormsModule,
    DatePickerModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @Input() employee!: Employee
  copiedEmployee!: Employee
  userRole: string = 'admin';
  editModeProfile: boolean = false;
  editModeJob: boolean = false;
  editModeContract: boolean = false;
  uploadedFiles: any[] = [];
  fileUpload!: FileUpload;
  statusOptions!: { label: string; value: EmployeeStatus }[];
  contractTypes!: { label: string; value: ContractType }[];
  employmentType!: { label: string; value: EmploymentType }[];
  saleryBand!: { label: string; value: SalaryBand }[];

  constructor(private messageService: MessageService, private employeeService: EmployeesService) { }

  ngOnInit(): void {
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

    this.saleryBand = [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'D', value: 'D' }
    ];
  }

  copyEmployeeData() {
    // Tiefe Kopie (deep copy) erstellen
    this.copiedEmployee = JSON.parse(JSON.stringify(this.employee));
  }

  getChangedFields(): Partial<Employee> {
    const changes = {} as Partial<Employee>;
    (Object.keys(this.employee) as Array<keyof Employee>).forEach((key) => {
      if (this.copiedEmployee[key] !== this.employee[key]) {
        (changes as any)[key] = this.employee[key];
      }
    });
    return changes;
  }

  saveEmployee() {
    const changes = this.getChangedFields();
    if (Object.keys(changes).length === 0) {
      return;
    } else {
      if (this.employee.id) {
        this.employeeService.saveEmployee(changes, this.employee.id);
        this.showSaveSuccessToast();
      }
    }
  }

  enterProfileEditMode() {
    this.editModeProfile = true;
    this.copyEmployeeData();
  }

  cancelProfileEdit() {
    this.employee = JSON.parse(JSON.stringify(this.copiedEmployee));
    this.editModeProfile = false;
  }

  saveProfileEmployee() {
    this.editModeProfile = false;
    this.saveEmployee();
  }


  enterJobEditMode() {
    this.editModeJob = true;
    this.copyEmployeeData();
  }

  cancelJobEdit() {
    this.employee = JSON.parse(JSON.stringify(this.copiedEmployee));
    this.editModeJob = false;
  }

  saveJobEmployee() {
    this.editModeJob = false;
    this.saveEmployee();
  }

  enterContractEditMode() {
    this.editModeContract = true;
    this.copyEmployeeData();
  }

  cancelContractEdit() {
    this.employee = JSON.parse(JSON.stringify(this.copiedEmployee));
    this.editModeContract = false;
  }

  saveContractEmployee() {
    this.editModeContract = false;
    this.saveEmployee();
  }

  onUpload(event: any, fileUpload: FileUpload) {
    if (this.employee.id) {
      for (let file of event.files) {
        const cleanFileName = file.name
          .replace(/\s+/g, '_')       // Leerzeichen durch _ ersetzen
          .replace(/[()]/g, '')       // Klammern entfernen
          .replace(/[^a-z0-9_.-]/gi, ''); // Alle unerwünschten Zeichen entfernen
        this.employeeService.uploadEmployeeAvatar(this.employee.id, cleanFileName, file)
      }
    }
  }

  showSaveSuccessToast() {
    this.messageService.add({
      key: 'saveSuccess',
      severity: 'success',
      summary: 'Gespeichert',
      detail: 'Ihre Änderungen wurden erfolgreich übernommen.'
    });
  }

}
