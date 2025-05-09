import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import camelcaseKeys from 'camelcase-keys';
import { Employee } from '../../shared/models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(private clientService: ClientService) {
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


}
