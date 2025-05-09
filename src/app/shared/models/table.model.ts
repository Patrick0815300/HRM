import { Employee } from "./employee.model";

export interface Table {
    field: keyof Employee | 'actions';   // Datenfeld
    header: string;                      // Überschrift (i18n-Key möglich)
    roles?: string[];                    // wer sieht die Spalte? (leere = alle)
    width?: string;                      // optionale feste Breite

}
