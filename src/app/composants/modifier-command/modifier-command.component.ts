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
import { GravureDto } from 'src/gs-api/src/models/Gravure-dto';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { HttpClient } from '@angular/common/http';

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
  selectedCat:string = 'chaine';
  adresseDto: AdresseDto = {};
  EtatCommandes: Array<string> = ['Delivered', 'Out of delivery', 'Terminée', 'Annulée',
   'Retournée','Nouvelle commande','Production','Pre-Production',
   'En cours','Attente validation', 'Livraison échouée','Attente paiement','Ready for production'];
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
  Droite='';
  Gauche='';
  Taille=''
  Role:any;
  Note = '';
  bague=false;
  chaine=false;
  Pendatif=false;
  Collier=false
 ;
 currentPage=1
 PrixVerso=false ;
 mvtstock:Array<any> = [];


  Braclet=false
  quantiteArgent=0
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();

  lignesCommande: Array<any> = [];
  totalCommande = 0;
  articleNotYetSelected = false;
  idCommand: any;
  listCategories: Array<any> = [];
  disabled=false;



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private CmdcltfrsService: CmdcltfrsService,
    private articleService: ArticleService,
    private categoryService:CategoryService,
    private userServices: UserService,
    private http: HttpClient

  ) { }

  ngOnInit(): void {
    this.Role =this.userServices.getUserRoleFromToken()
    const idClient = this.activatedRoute.snapshot.params.idObject;
    console.log('idClient',idClient);
    this.calculerTotalCommande();
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findObject();
    this.findAllLignesCommande();
    this.findAllCategories()
    
  }
  findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories = res;
    });
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
    if ( this.selectedCat==='chaine' ) {
      this.chaine=true;
      this.bague=false;
      this.Pendatif=false;
      this.Collier=false;
      this.Braclet=false;



    }
    if(this.selectedCat==='Bague'){
      this.bague=true;

      this.chaine=false;;
  
      this.Pendatif=false;
      this.Collier=false;
      this.Braclet=false;
    }
    if (this.selectedCat==='Pendatif'){
this.Pendatif=true

this.bague=false;

      this.chaine=false;
  
      this.Collier=false;
      this.Braclet=false;
    }
    if(this.selectedCat==='Collier'){
      this.Collier=true


      this.Pendatif=false;

this.bague=false;

      this.chaine=false;
  
      this.Braclet=false;
    }
    if(this.selectedCat==='Braclet'){
      this.Braclet=true
      this.Collier=false;


      this.Pendatif=false;

this.bague=false;

      this.chaine=false;
  
      
    }
    console.log(`Fetching page ${this.currentPage}...`);
    const perPage = 1000; // Set your desired items per page here
  
    const url = `http://localhost:3000/api/article/all/${this.selectedCat}?page=${this.currentPage}&perPage=${perPage}&searchQuery=${this.codeArticle}`;
    this.http.get<any>(url).subscribe((data) => {
      console.log('API response:', data);
      this.listArticle = data.articles;
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
          if(this.Command.etatCommande==='Delivered' && this.Role==='User'){
            this.disabled=true;
          }

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
      if(ligne.PrixVerso && ligne.quantite && ligne.prixUnitaire){
        this.totalCommande += +ligne.quantite *5;
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
      const Gravure:GravureDto={
        Recto: this.Recto,
        Verso: this.Verso,
        Droite: this.Droite,
        Gauche: this.Gauche
      }
      const ligneCmd: LigneCommandeClientDto = {
        article: this.searchedArticle,
        Gravure: Gravure,
        Platinage:this.Platinage,
        Taille:this.Taille,
        Note: this.Note,
        prixUnitaire: this.searchedArticle.prixUnitaireTtc,
        quantite: +this.quantite || 1,
        PrixVerso:this.PrixVerso,
        quantiteArgent:this.searchedArticle.quantiteArgent
      };
      console.log('ffffffffff',ligneCmd);
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
    this.disabled = true; // Disable the button to prevent multiple clicks

    console.log('commandeligneCommandeClients');

    const commande = this.preparerCommande();
    console.log('commandeligneCommandeClients', commande.ligneCommandeClients);

    this.CmdcltfrsService.enregistrerCommandeClient(commande as CommandeClientDto)
      .subscribe(
        cmd => {
          this.router.navigate(['commandesclient']);
        },
        error => {
          this.errorMsg = error.error.errors;
        }
      )
      .add(() => {
        this.disabled = false; // Re-enable the button after request completes
      });
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
        codeSuivi : this.Command.codeSuivi,
        noteLivraison:this.Command.noteLivraison
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
