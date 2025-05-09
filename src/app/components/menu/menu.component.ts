import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOption {
  icon: string;
  title: string;
  route?: string;
}

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})

export class MenuComponent {
  menuOptions: MenuOption[] = [
    { icon: 'dashboard', title: 'Dashboard', route: '/dashboard' },
    { icon: 'groups', title: 'Mitarbeiter', route: '/employeesManagement' },
    { icon: 'event', title: 'Abwesenheiten', route: '/absences' },
    { icon: 'schedule', title: 'Zeiterfassung', route: '/timesheets' },
    { icon: 'description', title: 'Dokumente', route: '/documents' },
    { icon: 'playlist_add_check', title: 'Onboarding', route: '/onboarding' },
    { icon: 'trending_up', title: 'Performance', route: '/performance' },
    { icon: 'bar_chart', title: 'Berichte', route: '/reports' },
    { icon: 'settings', title: 'Einstellungen', route: '/settings' },
    { icon: 'help_outline', title: 'Hilfe', route: '/help' }
  ];


}
