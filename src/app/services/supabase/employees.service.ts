import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import { Employee } from '../../shared/models/employee.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  userId?: string;
  profileId?: string;

  constructor(private clientService: ClientService) {
  }

  private toSnakeCase(obj: any): any {
    const snakeCaseObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        snakeCaseObj[snakeKey] = obj[key];
      }
    }
    return snakeCaseObj;
  }


  private mapParams(employee: Employee, email: string) {
    return {
      p_contract_type: employee.contractType,
      p_email: email,
      p_employment_type: employee.employmentType,
      p_first_name: employee.firstName,
      p_job_title: employee.jobTitle,
      p_last_name: employee.lastName,
      p_password: 'Password123',
      p_start_date: employee.startDate,
      p_status: employee.status
    };
  }


  getSession() {
    return this.clientService.getCurrentUser();
  }

  // async signInAnonymously() {
  //   const { data, error } = await this.clientService.signInAnonymously();
  //   if (error) {
  //     console.error('Fehler beim anonymen Login:', error);
  //   } else {
  //     console.log('Anonymer User angemeldet:', data.user);
  //   }
  // }

  // ---------------------------------------------- GET EMPLOYEE DATA ----------------------------------------------

  /**
   * Retrieves all employee records from the database.
   * Fetches all employee entries from the 'employees' table and converts their keys to camelCase.
   * 
   * @async
   * @returns {Promise<Employee[]>} A promise that resolves to an array of Employee objects.
   * @throws {Error} Throws an error if the database query fails.
   */
  async getAllEmployeesData(): Promise<Employee[]> {
    const { data: raw, error } = await this.clientService.client
      .from('employees')
      .select('*');
    if (error) throw error;
    return camelcaseKeys(raw ?? [], { deep: true }) as Employee[];
  }

  /**
   * Retrieves a single employee record by employee ID.
   * Fetches the employee entry from the 'employees' table that matches the given ID and converts its keys to camelCase.
   *
   * @async
   * @param {string} id - The unique identifier of the employee.
   * @returns {Promise<Employee>} A promise that resolves to the Employee object.
   * @throws {Error} Throws an error if the database query fails.
   */
  async getEmployeesDataById(id: string): Promise<Employee> {
    const { data, error } = await this.clientService.client
      .from('employees')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error;
    return camelcaseKeys(data!, { deep: true }) as Employee;
  }

  /**
   * Retrieves the employee record associated with the currently authenticated user.
   * Fetches the employee entry from the 'employees' table that matches the current user's ID.
   *
   * @async
   * @returns {Promise<any>} A promise that resolves to the employee data object.
   * @throws {Error} Throws an error if the database query fails.
   */
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

  /**
   * Retrieves the role of the employee associated with the currently authenticated user.
   * Fetches the 'role' field from the 'employees' table for the current user's ID.
   *
   * @async
   * @returns {Promise<string>} A promise that resolves to the employee's role.
   * @throws {Error} Throws an error if the database query fails.
   */
  async getEmployeesRoleByUserId() {
    const id = await this.clientService.getCurrentUserId();
    const { data, error } = await this.clientService.client
      .from('profiles')
      .select('role')
      .eq('user_id', id)
      .single()
    if (error) throw error;
    return data.role;
  }

  async getID() {
    const id = await this.clientService.getCurrentUserId();
    console.log('ID: ' + id);
  }

  // ---------------------------------------------- ADD, SAVE, UPDATE EMPLOYEE and USER ----------------------------------------------

  async createEmployeeWithUser(employee: Employee, email: string): Promise<string> {
    try {
      const userId = await this.createUser(employee, email);
      const profileId = await this.createProfile(employee, userId);
      const employeeSnakeCase = this.toSnakeCase({
        ...employee,
        user_id: userId,
        profile_id: profileId
      });
      return await this.createEmployee(employeeSnakeCase);
    } catch (error) {
      console.error('Fehler beim Erstellen des Mitarbeiters:', error);
      throw error;
    }
  }

  async createUser(employee: Employee, email: string): Promise<string> {
    const password = 'Password123';
    const { data: user, error: authError } = await this.clientService.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: employee.firstName,
          last_name: employee.lastName
        }
      }
    });
    if (authError) throw authError;
    if (!user?.user?.id) throw new Error("User creation failed: No ID returned");
    return user.user.id;
  }

  async createProfile(employee: Employee, userId: string): Promise<string> {
    const { data: profileData, error: profileError } = await this.clientService.client
      .from('profiles')
      .insert({
        user_id: userId,
        role: 'employee',
        first_name: employee.firstName,
        last_name: employee.lastName
      })
      .select('id')
      .single();

    if (profileError) throw profileError;
    return profileData.id
  }

  async createEmployee(employeeSnakeCase: Employee) {
    const { data: employeeData, error: employeeError } = await this.clientService.client
      .from('employees')
      .insert(employeeSnakeCase)
      .select('id')
      .single();

    if (employeeError) throw employeeError;
    return employeeData.id;
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

  async deleteEmployee(userId: string, employeeId: string): Promise<boolean> {
    try {
      //Storage Dateien Löschen - Avatar
      await this.deleteEmployeeStorage(employeeId);

      // Profile Löschen
      await this.deleteProfile(userId);

      // User löschen
      const { error: userError } = await this.clientService.client.auth.admin.deleteUser(userId);
      if (userError) throw userError;

      return true
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error);
      throw new Error('Employee konnte nicht gelöscht werden: ' + error);
    }
  }

  async deleteEmployeeStorage(employeeId: string) {
    const { error } = await this.clientService.client
      .storage
      .from('employees-avatar')
      .remove([employeeId]);
    if (error) throw error
  }

  async deleteProfile(userId: string) {
    const { data, error } = await this.clientService.client
      .from('profiles')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  }

  async uploadEmployeeAvatar(employeeId: string, fileName: string, file: File): Promise<string | null> {
    try {
      // 1. Datei in Storage hochladen
      const { data: uploadData, error: uploadError } = await this.clientService.client.storage
        .from('employees-avatar')
        .upload(`${employeeId}/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Pfad in Datenbank speichern
      const avatarPath = uploadData.path;
      const { error: updateError } = await this.clientService.client
        .from('employees')
        .update({ avatar_path: avatarPath })
        .eq('id', employeeId);

      if (updateError) throw updateError;

      return avatarPath;
    } catch (error) {
      console.error('Avatar-Upload fehlgeschlagen:', error);
      return null;
    }
  }

  async getAvatarUrl(avatarPath: string): Promise<string | null> {
    const { data, error } = await this.clientService.client.storage
      .from('employees-avatar')
      .createSignedUrl(avatarPath, 60 * 60); // 1 Stunde gültig

    if (error) {
      console.error('Fehler beim Erstellen der signierten URL:', error);
      return null;
    }
    return data.signedUrl;
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
