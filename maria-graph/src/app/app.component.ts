import { AuthService } from './shared/auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'maria-graph';

  constructor(
    public authService: AuthService
  ){    
  }

  logout() {
    this.authService.doLogout()
  }
}