import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { ViewChild, enableProdMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../shared/auth/auth.service';
import { Component, OnInit } from '@angular/core';
// import jsonData from  './../data/diagram-flow.json';

if(!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css'],
  preserveWhitespaces: true
})
export class DiagramComponent implements OnInit {

  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;
  
  diaJon;

  constructor(
    private authService: AuthService,
    http: HttpClient
  ) {
    // this.diaJon = jsonData;
    // console.log('mgOnInit: ', this.diaJon);
    // setTimeout(() => {
    //   this.diagram.instance.import(JSON.stringify(this.diaJon));
    // }, 600);
    
    // http.get('./../data/diagram-hardware.json').subscribe(data => {
    //     this.diagram.instance.import(JSON.stringify(data));
    //     console.log('Json: ', this.diagram);
    // }, err => {
    //   console.warn('Erro: ', err.statusText);        
    //     // throw 'Data Loading Error'
    // });
  }

  ngOnInit(): void {
  }

}
