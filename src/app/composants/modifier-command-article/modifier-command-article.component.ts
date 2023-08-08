import { Component, Input, OnInit } from '@angular/core';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';

@Component({
  selector: 'app-modifier-command-article',
  templateUrl: './modifier-command-article.component.html',
  styleUrls: ['./modifier-command-article.component.scss']
})
export class ModifierCommandArticleComponent implements OnInit {

  @Input()
  ligneCommande: LigneCommandeClientDto = {};
  constructor() { }

  ngOnInit(): void {
  }

}
