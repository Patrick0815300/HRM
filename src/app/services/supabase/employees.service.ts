import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { Employee } from '../../shared/models/employee.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeesService {


  constructor(private clientService: ClientService) {
  }

  async signInAnonymously() {
    const { data, error } = await this.clientService.signInAnonymously();
    if (error) {
      console.error('Fehler beim anonymen Login:', error);
    } else {
      console.log('Anonymer User angemeldet:', data.user);
    }
  }

  getSession() {
    return this.clientService.getCurrentUser();
  }

  async getAllEmployeesData(): Promise<Employee[]> {
    const { data: raw, error } = await this.clientService.client
      .from('employees')
      .select('*');
    if (error) throw error;
    return camelcaseKeys(raw ?? [], { deep: true }) as Employee[];
  }

  async getEmployeesDataById(id: string): Promise<Employee> {
    const { data, error } = await this.clientService.client
      .from('employees')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error;
    return camelcaseKeys(data!, { deep: true }) as Employee;
  }

  async getEmployeeDataByUserId() {
    const id = await this.clientService.getCurrentUserId();
    const { data, error } = await this.clientService.client
      .from('employees')
      .select('*')
      .eq('user_id', id)
      .single()
    if (error) throw error;
    return data;
  }

  async getEmployeesRoleByUserId() {
    const id = await this.clientService.getCurrentUserId();
    const { data, error } = await this.clientService.client
      .from('employees')
      .select('role')
      .eq('user_id', id)
      .single()
    if (error) throw error;
    return data.role;
  }

  async saveEmployee(changes: Partial<Employee>, employeeId: string) {
    // keys in snake_case umwandeln
    const snakeCaseChanges = snakecaseKeys(changes);
    const { data, error } = await this.clientService.client
      .from('employees')
      .update(snakeCaseChanges)
      .eq('id', employeeId)
      .select();

    if (error) throw error;
    return data;
  }

  uploadEmployeeAvatar(employeeId: string, fileName: string, file: File) {
    const filePath = `${employeeId}/${fileName}`;
    return this.clientService.client.storage.from('employees-avatar').upload(filePath, file);
  }

  async createUserAndEmployee(email: string, employee: Employee) {
    const userId = await this.addUser(email, employee);
    return await this.addEmployee(employee, userId!);
  }

  async addEmployee(employee: Employee, userId: string) {
    const employeeToInsert = {
      ...employee,
      user_id: userId,
    };
    const { data, error } = await this.clientService.client
      .from('employees')
      .insert([snakecaseKeys(employeeToInsert)])
      .select();
    if (error) throw error;
    return data?.[0];
  }


  async addUser(email: string, employee: Employee) {
    const { data, error } = await this.clientService.client.auth.signUp({
      email,
      password: 'Password123',
      options: {
        data: {
          first_name: employee.firstName,
          last_name: employee.lastName
        }
      }
    });
    if (error) throw error;
    return data.user?.id;
  }


  async getUserId(email: string) {
    const { data, error } = await this.clientService.client
      .from('auth_users')
      .select('id')
      .eq('email', email)
      .single();
    if (error) throw error;
    return data?.id;
  }




}
