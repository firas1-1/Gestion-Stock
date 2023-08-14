import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import { ArticleService } from '../../services/article/article.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GravureDto } from 'src/gs-api/src/models/Gravure-dto';

@Component({
  selector: 'app-detail-cmd',
  templateUrl: './detail-cmd.component.html',
  styleUrls: ['./detail-cmd.component.scss']
})
export class DetailCmdComponent implements OnInit {
  @Input()
  Role='';
  @Input()
  ligneCommande: LigneCommandeClientDto = {};
  origin=''
  @Output()
  suppressionResult = new EventEmitter();
  update= false;

  @Input()
  etatCommande=''

  Recto='';
  Verso='';
  Braclet=false;
  bague=false;
  chaine=false;
  Pendatif=false;
  Collier=false
  disabled=false
  
  Gauche=''; 
  Droite=''; 
  listeCommandes: any;

  constructor(private CmdcltfrsService:CmdcltfrsService,
              private activatedRoute:ActivatedRoute,
              private route: Router,
              private http: HttpClient,
              private cmdCltFrsService: CmdcltfrsService,

              ) { }

  ngOnInit(): void {
    console.log('ggg',this.Role,this.etatCommande)

    if(this.etatCommande==='Delivered' && this.Role==='User'){
      this.disabled=true
    }
    if(this.ligneCommande.article?.category?.code==='chaine'){
      this.chaine=true;
      this.bague=false;
      this.Pendatif=false;
      this.Collier=false;
      this.Braclet=false;
    }
    if(this.ligneCommande.article?.category?.code==='bague'){
      this.chaine=false;
      this.bague=true;
      this.Pendatif=false;
      this.Collier=false;
      this.Braclet=false;
    }
    if(this.ligneCommande.article?.category?.code==='Pendatif'){
      this.chaine=false;
      this.bague=false;
      this.Pendatif=true;
      this.Collier=false;
      this.Braclet=false;
    }
    if(this.ligneCommande.article?.category?.code==='Collier'){
      this.chaine=false;
      this.bague=false;
      this.Pendatif=false;
      this.Collier=true;
      this.Braclet=false;
    }
    if(this.ligneCommande.article?.category?.code==='Braclet'){
      this.chaine=false;
      this.bague=false;
      this.Pendatif=false;
      this.Collier=false;
      this.Braclet=true;
    }
    
    console.log('Role',this.Role)
    console.log(this.ligneCommande,'ffefefefefefe')

    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    if ( this.origin==='update'){
        this.update=true
    } else {
        console.log('failed')
    }
    
  }
 
  
modifyLigne(): void {
  this.preparerLigneCommande()
  
  this.cmdCltFrsService.updateLigne(this.ligneCommande).subscribe(data => {
    console.log(data)
    this.ngOnInit()
  this.Recto='';
  this.Verso='';

  })
}



private preparerLigneCommande(): void { 
    const Gravure:GravureDto={
      Recto: this.Recto,
      Verso: this.Verso,
      Droite: this.Droite,
      Gauche: this.Gauche
    }
    const ligneCmd: LigneCommandeClientDto = {
      _id:this.ligneCommande._id,
      Gravure: Gravure,
      Platinage:this.ligneCommande.Platinage,
      Taille:this.ligneCommande.Taille,
      Note: this.ligneCommande.Note,
      PrixVerso:this.ligneCommande.PrixVerso,
      quantiteArgent:this.ligneCommande.quantiteArgent
    };
    this.ligneCommande=ligneCmd;
  }






  supprimerArticle(): void {
    if (this.ligneCommande._id) {
      console.log('ligne',this.ligneCommande._id)
      this.CmdcltfrsService.deleteLigneCommand(this.ligneCommande._id)
      .subscribe(res => {
         this.suppressionResult.emit('success');         
       }, error => {
        this.suppressionResult.emit(error.error.error);
      });
   } else {
    window.location.reload();

  }
   
  }
  
}
