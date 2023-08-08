import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClientDto} from '../../../gs-api/src/models/client-dto';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-cmd-clt-frs',
  templateUrl: './detail-cmd-clt-frs.component.html',
  styleUrls: ['./detail-cmd-clt-frs.component.scss']
})
export class DetailCmdCltFrsComponent implements OnInit {
on = false;
off=true
  @Input()
  origin = '';
  @Input()


  commande: any = {};
  cltFrs: ClientDto | undefined = {};
  @Output()
  suppressionResult = new EventEmitter();
  icon: string='';
  constructor(
    private router: Router,
    private CmdcltfrsService: CmdcltfrsService) { }

  ngOnInit(): void {
    console.log('fourniseeurcommande');
    this.extractClientFournisseur();
    if ( this.commande.etatCommande==='Delivered') {
      this.on=true;
      this.off= false
    }
    if ( this.commande.etatCommande==='Delivered') {
      this.icon='badge rounded-pill badge-soft-success fs--2'
    }
    if ( this.commande.etatCommande==='Nouvelle commande') {
      this.icon='badge rounded-pill badge-soft-primary fs--2'
    }
    if ( this.commande.etatCommande==='Production') {
      this.icon='badge rounded-pill badge-soft-warning fs--2'
    }
    if ( this.commande.etatCommande==='Pre-Production') {
      this.icon='badge rounded-pill badge-soft-info fs--2'
    }
    
  }

  modifierClick(): void {
    if (this.origin === 'client') {
      this.router.navigate(['modifierCommande', this.commande._id]);
      console.log(this.commande);
    }
  }
  Facture(): void {
    this.router.navigate(['factureCommande', this.commande._id]);
  }

  extractClientFournisseur(): void {
    if (this.origin === 'client') {
      this.cltFrs = this.commande?.client;
      console.log('dddddddddddd',this.commande)
    } else if (this.origin === 'fournisseur') {
      this.cltFrs = this.commande.fournisseur;
    }
  }
  confirmerEtSupprimerArticle(): void {
    if (this.commande._id) {
      console.log('idCommand',this.commande._id)
      this.CmdcltfrsService.deleteArticle(this.commande._id)
      .subscribe(res => {
         this.suppressionResult.emit('success');
        
       }, error => {
        this.suppressionResult.emit(error.error.error);
      });
   }
  }
}
