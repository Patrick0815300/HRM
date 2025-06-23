/* ──────────────────────────────── *
 *  Employee domain model (v1.0)    *
 * ──────────────────────────────── */

/** High-level employment lifecycle status */
export type EmployeeStatus =
    | 'active'        // currently employed
    | 'on_leave'      // parental- / sabbatical-leave etc.
    | 'terminated';   // off-boarded, no longer active

/** Type of contract with the company */
export type ContractType =
    | 'permanent'
    | 'fixed_term'
    | 'internship'
    | 'temporary';

/** Working hours model */
export type EmploymentType =
    | 'full_time'
    | 'part_time';

/** Optional salary band enumeration */
export type SalaryBand = 'A' | 'B' | 'C' | 'D';

/** User roles within the HRM system */
export enum EmployeeRole {
    HRManager = 'hr_manager',
    Employee = 'employee',
    SystemAdmin = 'admin'
}

/** Main Employee interface (syncs 1-to-1 with Supabase `employees` table) */
export interface Employee {
    /* ─── Identifiers ─────────────────────── */
    id?: string;                     // UUID primary key
    userId?: string;                // FK to auth.users (optional for external staff)

    /* ─── Personal data ───────────────────── */
    firstName: string;
    lastName: string;
    preferredName?: string;         // e.g. Nickname
    birthDate?: string;             // ISO-8601
    zipCode?: string;
    city?: string;
    address?: string;

    /* ─── Contact ─────────────────────────── */
    workEmail: string;
    phone?: string;

    /* ─── Employment details ──────────────── */
    jobTitle: string;
    departmentId?: string;
    departmentName?: string;        // denormalised for quick lists
    teamId?: string;
    managerId?: string;

    startDate: string;              // ISO date
    endDate?: string;

    contractType: ContractType;
    employmentType: EmploymentType;
    weeklyHours?: number;           // e.g. 40.0

    status: EmployeeStatus;

    /* ─── Compensation (optional) ─────────── */
    salaryBand?: SalaryBand;        // show band only for HR/Admin
    monthlySalary?: number;         // sensitive – restrict by role

    /* ─── HR metrics ─────────────────────── */
    remainingPto?: number;          // vacation days left
    nextReviewDate?: string;        // planned performance review

    /* ─── Media & misc. ───────────────────── */
    avatarUrl?: string;             // Supabase Storage path
    customAttributes?: Record<string, unknown>; // JSONB for extra fields

    /* ─── Audit ───────────────────────────── */
    createdAt: string;              // timestamptz
    updatedAt: string;

    /* ─── Role & Permissions ──────────────── */
    role: EmployeeRole; //
}

