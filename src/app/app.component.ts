import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./components/menu/menu.component";
import { HeaderComponent } from './components/header/header.component';
import { ClientService } from './services/supabase/client.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'supabase-hrm';

  constructor(private clientService: ClientService) {
    //console.log(this.clientService.getCurrentUser());
  }
}
