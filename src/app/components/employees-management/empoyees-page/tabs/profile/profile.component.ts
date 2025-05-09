import { Component, Input, OnInit } from '@angular/core';
import { Employee } from '../../../../../shared/models/employee.model';
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
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @Input() employee!: Employee
  userRole: string = 'admin';
  editMode: boolean = false;
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  enterEditMode() {
    this.editMode = !this.editMode
    console.log(this.editMode);

  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.messageService.add({
        severity: 'info',
        summary: 'Upload erfolgreich',
        detail: `${event.files.length} Datei(en) hochgeladen`
      });

    }

    //this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

}
