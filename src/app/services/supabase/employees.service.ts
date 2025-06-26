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
    const password = 'Password123';

    // 1. User erstellen
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

    // 2. Profile erstellen UND DIE ID ABRUFEN
    const { data: profileData, error: profileError } = await this.clientService.client
      .from('profiles')
      .insert({
        user_id: user.user?.id,
        role: 'employee',
        first_name: employee.firstName,
        last_name: employee.lastName
      })
      .select('id') // WICHTIG: ID des neuen Profils abrufen
      .single();

    if (profileError) throw profileError;

    // 3. Employee mit der PROFIL-ID erstellen
    const employeeSnakeCase = this.toSnakeCase({
      ...employee,
      user_id: user.user?.id,
      profile_id: profileData.id // Korrekte Profil-ID verwenden
    });

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



  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      // 1. Zuerst zugehörigen User löschen
      const userDeleteResult = await this.clientService.client
        .from('employees')
        .select('user_id')
        .eq('id', employeeId)
        .single();

      if (userDeleteResult.error) throw userDeleteResult.error;

      const userId = userDeleteResult.data.user_id;

      // 2. User aus Auth-Tabelle löschen
      const { error: authError } = await this.clientService.client.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      // 3. Employee-Datensatz löschen
      const { error: employeeError } = await this.clientService.client
        .from('employees')
        .delete()
        .eq('id', employeeId);

      if (employeeError) throw employeeError;

      return true; // Erfolg
    } catch (error) {
      console.error('Löschen fehlgeschlagen:', error);
      throw new Error('Employee konnte nicht gelöscht werden: ' + error);
    }
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
