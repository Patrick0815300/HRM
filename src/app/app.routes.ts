import { Routes } from '@angular/router';
import { EmployeesManagementComponent } from './components/employees-management/employees-management.component';
import { EmpoyeesPageComponent } from './components/employees-management/empoyees-page/empoyees-page.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'employeesManagement', component: EmployeesManagementComponent },
            { path: 'employeesPage/:id', component: EmpoyeesPageComponent },
        ]
    },

];
