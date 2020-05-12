import { Component, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DiagramService } from './shared/api/diagram.service';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'save-button',
  template:  `
  <button (click)="saveDiagram()" type="button" class="btn btn-outline-secondary">Salvar</button>`
})
export class SaveButtonComponent implements OnInit{

  constructor(
    private diagServ: DiagramService,
    public authService: AuthService
  ){    
  }

  ngOnInit(){
    this.diagServ.diagramSource.subscribe(message => {
      message = message;
    })
  }

  saveDiagram(){
    this.diagServ.buttonToSave('salvar');
  }
}