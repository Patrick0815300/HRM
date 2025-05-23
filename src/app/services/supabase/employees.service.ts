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

  signupEmployee(email: string) {
    this.clientService.signUp(email)
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

  async addEmployee(employee: Employee) {
    // Wandelt alle camelCase-Keys in snake_case um
    const employeeToInsert = snakecaseKeys(employee as unknown as Record<string, unknown>);
    const { data, error } = await this.clientService.client
      .from('employees')
      .insert([employeeToInsert])
      .select();

    if (error) {
      console.error('Fehler beim Hinzufügen des Employees:', error.message);
      throw error;
    }
  }



}
