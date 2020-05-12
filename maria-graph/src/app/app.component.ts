import { ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { DiagramService } from './shared/api/diagram.service';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  message: string;

  constructor(
    private diagServ: DiagramService,
    public authService: AuthService,
  ){    
    this.diagServ.diagramSource.subscribe(message => {
      message = message;
    })
  }

  logout() {
    this.authService.doLogout();
  }
}