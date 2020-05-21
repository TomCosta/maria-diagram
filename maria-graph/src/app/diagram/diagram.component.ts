import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { DiagramService } from '../shared/api/diagram.service';
import { OrgItem, OrgLink } from '../shared/models/diagram';
import { ViewChild, enableProdMode } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_alert';

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
  
  id;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  orgItems: OrgItem[] = [{
        'ID': '106',
        'Text': 'Development',
        'Type': 'ellipse'
    },
    {
        'ID': '107',
        'Text': 'WinForms\nTeam',
        'Type': 'ellipse'
    },
    {
        'ID': '108',
        'Text': 'WPF\nTeam',
        'Type': 'ellipse'
    },
    {
        'ID': '109',
        'Text': 'Javascript\nTeam',
        'Type': 'ellipse'
    },
    {
        'ID': '110',
        'Text': 'ASP.NET\nTeam',
        'Type': 'ellipse'
    },
    {
        'ID': '112',
        'Text': 'Ana\nTrujillo',
        'Type': 'rectangle'
    },
    {
        'ID': '113',
        'Text': 'Antonio\nMoreno',
        'Type': 'rectangle'
    },
    {
        'ID': '115',
        'Text': 'Christina\nBerglund',
        'Type': 'rectangle'
    },
    {
        'ID': '116',
        'Text': 'Hanna\nMoos',
        'Type': 'rectangle'
    },
    {
        'ID': '117',
        'Text': 'Frederique\nCiteaux',
        'Type': 'rectangle'
    },
    {
        'ID': '119',
        'Text': 'Laurence\nLebihan',
        'Type': 'rectangle'
    },
    {
        'ID': '120',
        'Text': 'Elizabeth\nLincoln',
        'Type': 'rectangle'
    },
    {
        'ID': '122',
        'Text': 'Patricio\nSimpson',
        'Type': 'rectangle'
    },
    {
        'ID': '123',
        'Text': 'Francisco\nChang',
        'Type': 'rectangle'
    }
  ];

  orgLinks: OrgLink[] = [
    {
        'ID': '124',
        'From': '106',
        'To': '108',
    },
    {
        'ID': '125',
        'From': '106',
        'To': '109',
    },
    {
        'ID': '126',
        'From': '106',
        'To': '107',
    },
    {
        'ID': '127',
        'From': '106',
        'To': '110',
    },
    {
        'ID': '129',
        'From': '110',
        'To': '112',
    },
    {
        'ID': '130',
        'From': '110',
        'To': '113',
    },
    {
        'ID': '132',
        'From': '107',
        'To': '115',
    },
    {
        'ID': '133',
        'From': '107',
        'To': '116',
    },
    {
        'ID': '134',
        'From': '107',
        'To': '117',
    },
    {
        'ID': '136',
        'From': '108',
        'To': '119',
    },
    {
        'ID': '137',
        'From': '108',
        'To': '120',
    },
    {
        'ID': '139',
        'From': '109',
        'To': '122',
    },
    {
        'ID': '140',
        'From': '109',
        'To': '123',
    }
  ];

  orgItemsDataSource: ArrayStore;
  orgLinksDataSource: ArrayStore;

  constructor(
    private diagServ: DiagramService,
    protected alertService: AlertService
  ){
  }

  // Ao iniciar executa apenas uma vez
  ngOnInit(): void {
    this.getDiagram();

    // Subscreve-se no serviço botão para Salvar
    this.diagServ.diagramSource.subscribe(message => {
      if(message==='salvar'){
        this.saveDiagram();
        // this.deleteDiagram('5ec5fca68f67c61cb8a4c0a3');
      }
    });
  }

  // Buscar por um diagrama no DB ou local
  async getDiagram(){
    try {
      this.diagServ.loadDG()
      .subscribe(res => {
        console.log('GET: ', res);
        if(res['data'].length>0 && res['data'][0]['orgItem'].length>0){
          this.id = res['data'][0]['_id'];
          let orgItems = res['data'][0]['orgItem'];
          let orgLinks = res['data'][0]['orgLink'];
          setTimeout(() => {
            this.showDiagram(orgItems, orgLinks);
          }, 300);
        }else{
          setTimeout(() => {
            this.showDiagram(this.orgItems, this.orgLinks);
          }, 300);
        }
      });
    } catch (error) {
      console.log('Rrror ', error);
    }  
  }

  // Inserir o diagrama no DOM
  showDiagram(orgItems, orgLinks){
    this.orgItemsDataSource = new ArrayStore({
      key: 'this',
      data: orgItems      
    });
    this.orgLinksDataSource = new ArrayStore({
        key: 'this',
        data: orgLinks
    }); 
  }

  // Salvar o diagrama
  saveDiagram(){
    try {
      let myObject = this.diagram.instance;
      if (myObject.hasOwnProperty('optionsUpdateBar')) {
        let orgItems = myObject['optionsUpdateBar'].onChanged.listeners[0].control.documentDataSource.nodeDataSource;
        let orgLinks = myObject['optionsUpdateBar'].onChanged.listeners[0].control.documentDataSource.edgeDataSource;
        console.log('Diagrama 👍🏽');
        this.diagServ.saveDG(this.id, orgItems, orgLinks)
        .subscribe(res => {
          console.log('MongoDB', res);
          this.showAlert('success', res.message);
        });
      }else{
        console.log('Ops Not found');
        this.showAlert('error', 'Erro ao salvar');
      }    
    } catch (error) {
      console.log('Error ', error);
      this.showAlert('error', error.message);
    }
  }

  // Deleta um Diagrama
  deleteDiagram(id) {
    this.diagServ.deleteDG(id)
      .subscribe(res => {
        console.log('Delete ', res);
        this.showAlert('success', res.message);
      });
  } catch(error) {
    console.log('Error ', error);
    this.showAlert('error', error.message);
  }

  showAlert(status, msg){
    if(status == 'success'){
      this.alertService.success(msg, this.options)    
    }else{
      this.alertService.error(msg, this.options)
    }
  }
  
  // Função acionada ao sair desta página
  ngOnDestroy(): void {    
  }

}
