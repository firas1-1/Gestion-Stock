import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import { ArticleService } from '../../services/article/article.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-cmd',
  templateUrl: './detail-cmd.component.html',
  styleUrls: ['./detail-cmd.component.scss']
})
export class DetailCmdComponent implements OnInit {

  @Input()
  ligneCommande: LigneCommandeClientDto = {};
  origin=''
    @Output()
  suppressionResult = new EventEmitter();
  update= false;

  constructor(private CmdcltfrsService:CmdcltfrsService,
              private activatedRoute:ActivatedRoute,
              private route: Router) { }

  ngOnInit(): void {
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
