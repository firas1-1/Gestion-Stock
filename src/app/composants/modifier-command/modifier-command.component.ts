import { Component, Input, OnInit } from '@angular/core';
import { CommandeClientDto } from '../../../gs-api/src/models/commande-client-dto';
import { ClientDto } from '../../../gs-api/src/models/client-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { PhotosService } from '../../../gs-api/src/services/photos.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { AdresseDto } from '../../../gs-api/src/models/adresse-dto';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';
import { ArticleService } from '../../services/article/article.service';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';
import { CommandeFournisseurDto } from '../../../gs-api/src/models/commande-fournisseur-dto';

@Component({
  selector: 'app-modifier-command',
  templateUrl: './modifier-command.component.html',
  styleUrls: ['./modifier-command.component.scss']
})
export class ModifierCommandComponent implements OnInit {
  @Input()
  origin = '';
  @Input()

 Command: any = {};
  ClientDto: ClientDto = {};
  adresseDto: AdresseDto = {};

  errorMsg: Array<string> = [];
  file: File | null = null;
  selectedClientFournisseur: any = {};
  listClientsFournisseurs: Array<any> = [];
  searchedArticle: ArticleDto = {};
  listArticle: Array<ArticleDto> = [];
  codeArticle = '';
  quantite = '';
  code = '';
  Recto = '';
  Verso = '';
  Platinage = '';
  Note = '';
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();

  lignesCommande: Array<any> = [];
  totalCommande = 0;
  articleNotYetSelected = false;
  idCommand: any;



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private CmdcltfrsService: CmdcltfrsService,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    const idClient = this.activatedRoute.snapshot.params.idObject;
    console.log('idClient',idClient);
    this.calculerTotalCommande();
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findObject();
    this.findAllLignesCommande();
  }

  filtrerArticle(): void {
    try {
      if (this.codeArticle.trim().length === 0) {
        console.log('No code provided. Retrieving all articles...');
        this.findAllArticles();
      } else {
        this.listArticle = this.listArticle.filter(art => {
          const codeArticle = art.codeArticle?.toLowerCase();
          const designation = art.designation?.toLowerCase();
          const searchTerm = this.codeArticle.trim().toLowerCase();
  
          return codeArticle?.includes(searchTerm) || designation?.includes(searchTerm);
        });
  
        if (this.listArticle.length === 0) {
          console.log('No matching articles found.');
        }
      }
    } catch (error) {
      console.error('Error occurred while filtering articles:', error);
      // Optionally, you could add code here to handle the error further or display an error message to the user.
    }
  }
  


  findAllArticles(): void {
    this.articleService.findAllArticles()
    .subscribe(articles => {
      this.listArticle = articles;
    });
  }


  findObject(): void {
    const id = this.activatedRoute.snapshot.params.id;
    console.log(id)
    if (id) {
      
        console.log('client')
        this.CmdcltfrsService.findAllCommandesClientbyid(id)
        .subscribe(command => {
          console.log('command1',command)
          this.Command = command;
          this.idCommand=this.Command._id
          this.ClientDto = this.Command.client;
          this.adresseDto = this.Command.client.adresse
          console.log('client+adresse0',this.Command.dateCommande);

        });
    }
  }


  cancelClick(): void {
      this.router.navigate(['commandesclient']);
  }


  mapToCommand():CommandeClientDto {
    const commandeDto: CommandeClientDto = this.Command;
    commandeDto.client = this.ClientDto;
    console.log('client+adresse',commandeDto);
    return commandeDto;
  }

  ajouterLigneCommande(): void {
    console.log(this.lignesCommande,'ligneCommand22')
    this.checkLigneCommande();
    this.calculerTotalCommande();
    this.searchedArticle = {};
    this.quantite = '';
    this.codeArticle = '';
    this.Recto='';
    this.Verso='';
    this.Platinage='';
    this.Note='';


    this.articleNotYetSelected = false;
    this.findAllArticles();
  }

  calculerTotalCommande(): void {
    this.totalCommande = 0;
    console.log('calculerTotalCommande')
    this.lignesCommande.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        console.log('calculerTotalCommande',ligne.prixUnitaire)

        this.totalCommande += +ligne.prixUnitaire * +ligne.quantite;
      }
    });
  }

  private checkLigneCommande(): void {
    const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.searchedArticle.codeArticle);
    if (ligneCmdAlreadyExists) {
      this.lignesCommande.forEach(lig => {
        if (lig && lig.article?.codeArticle === this.searchedArticle.codeArticle) {
          // @ts-ignore&
          lig.quantite = lig.quantite + +this.quantite;
        }
      });
    } else {
      const ligneCmd: LigneCommandeClientDto = {
        article: this.searchedArticle,
        prixUnitaire: this.searchedArticle.prixUnitaireTtc,
        quantite: +this.quantite ,
        Recto: this.Recto ,
        Verso: this.Verso ,
        Platinage : this.Platinage,
        Note: this.Note};
console.log('ligneCmd',ligneCmd);
      this.lignesCommande.push(ligneCmd);

    }
  }

  selectArticleClick(article: ArticleDto): void {
    console.log('seArticle', article);
    this.searchedArticle = article;
    this.codeArticle = article.codeArticle ? article.codeArticle : '';
    this.articleNotYetSelected = true;
  }
  supprimerArticle(){
console.log('supprimerArticle', );
  }
  enregistrerCommande(): void {
    console.log('commandeligneCommandeClients');

    const commande = this.preparerCommande();
    console.log('commandeligneCommandeClients', commande.ligneCommandeClients);
    
      this.CmdcltfrsService.enregistrerCommandeClient(commande as CommandeClientDto)
      .subscribe(cmd => {
        this.router.navigate(['commandesclient']);
      }, error => {
        this.errorMsg = error.error.errors;
      });
    // } else if (this.origin === 'fournisseur') {
    //   this.CmdcltfrsService.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto)
    //   .subscribe(cmd => {
    //     this.router.navigate(['commandesfournisseur']);
    //     console.log(cmd);
    //   }, error => {
    //     this.errorMsg = error.error.errors;
    //   });
     
  }
  

  private preparerCommande(): any {
    

console.log('lignesCommande11111111111111111111111',this.lignesCommande)
console.log('lignesCommande1111111111111111',this.ClientDto)
      return  {
        _id:this.activatedRoute.snapshot.params.id,
        client: this.ClientDto,
        code: this.Command.code,
        dateCommande: new Date().getTime(),
        etatCommande: this.Command.etatCommande,
        ligneCommandeClients: this.lignesCommande,
        Livraison : this.Command.Livraison,
        codeSuivi : this.Command.codeSuivi
      };
      
    // } else if (this.origin === 'fournisseur') {
    //   return  {
    //     fournisseur: this.ClientDto,
    //     code: this.code,
    //     dateCommande: new Date().getTime(),
    //     etatCommande: 'EN_PREPARATION',
    //     ligneCommandeFournisseurs: this.lignesCommande
    //   };
    // }
  }


  findAllLignesCommande(): void {
    const id = this.activatedRoute.snapshot.params.id;

     this.findLignesCommande(id);
     console.log(id)
   
  }

  

  findLignesCommande(idCommande?: number): void {
    console.log('list');
      this.CmdcltfrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => { 
        list.forEach(listItem => {
          this.lignesCommande.push(listItem);
        }
        )
        console.log(this.lignesCommande,'ligneCommand')
        console.log('list1',list);
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
      });
    
  }

  calculerTatalCmd(list: Array<LigneCommandeClientDto>): number {
    let total = 0;
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        total += +ligne.quantite * +ligne.prixUnitaire;
      }
    });
    return Math.floor(total);
  }

  
  

  handleSuppression(event: any): void {
    if (event === 'success') {
      let id = this.activatedRoute.snapshot.params.id
      

      window.location.reload();

    } else {
      this.errorMsg = event;
    }
  }

   
  

  

  
  

}
