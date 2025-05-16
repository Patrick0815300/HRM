import { Component, Input, OnInit } from '@angular/core';
import { ContractType, Employee, EmployeeStatus, EmploymentType, SalaryBand } from '../../../../../shared/models/employee.model';
import { FieldsetModule } from 'primeng/fieldset';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MatIconModule } from '@angular/material/icon';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

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
  userRole: string = 'admin';
  editModeProfile: boolean = false;
  editModeJob: boolean = false;
  editModeContract: boolean = false;
  uploadedFiles: any[] = [];
  statusOptions!: { label: string; value: EmployeeStatus }[];
  contractTypes!: { label: string; value: ContractType }[];
  employmentType!: { label: string; value: EmploymentType }[];
  saleryBand!: { label: string; value: SalaryBand }[];

  constructor(private messageService: MessageService) { }

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

  enterProfileEditMode() {
    this.editModeProfile = true;
  }

  cancelProfileEdit() {
    this.editModeProfile = false;
  }

  saveProfileEmployee() {
    this.editModeProfile = false;
    this.showSaveSuccessToast();
    // Servicefunktion fehlt noch
  }


  enterJobEditMode() {
    this.editModeJob = true;
    console.log(this.employee);

  }

  cancelJobEdit() {
    this.editModeJob = false;
  }

  saveJobEmployee() {
    this.editModeJob = false;
    console.log(this.employee);

    //this.showSaveSuccessToast();
    // Servicefunktion fehlt noch
  }


  enterContractEditMode() {
    this.editModeContract = true;
  }

  cancelContractEdit() {
    this.editModeContract = false;
  }

  saveContractEmployee() {
    this.editModeContract = false;
    this.showSaveSuccessToast();
    // Servicefunktion fehlt noch
  }


  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.messageService.add({
        key: 'upload',
        severity: 'info',
        summary: 'Upload erfolgreich',
        detail: `${event.files.length} Datei(en) hochgeladen`
      });
    }
    //thi
    // 
    // .messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
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
