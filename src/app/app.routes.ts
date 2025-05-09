import { Routes } from '@angular/router';
import { EmployeesManagementComponent } from './components/employees-management/employees-management.component';
import { EmpoyeesPageComponent } from './components/employees-management/empoyees-page/empoyees-page.component';

export const routes: Routes = [
    { path: '', component: EmployeesManagementComponent },
    { path: 'employeesManagement', component: EmployeesManagementComponent },
    { path: 'employeesPage/:id', component: EmpoyeesPageComponent },
];
