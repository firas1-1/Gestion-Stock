import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CltfrsService} from '../../services/cltfrs/cltfrs.service';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../services/article/article.service';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {CmdcltfrsService} from '../../services/cmdcltfrs/cmdcltfrs.service';
import {CommandeFournisseurDto} from '../../../gs-api/src/models/commande-fournisseur-dto';
import { MvtstkService } from 'src/gs-api/src/services';
import { CategoryService } from 'src/app/services/category/category.service';
import { GravureDto } from 'src/gs-api/src/models/Gravure-dto';

@Component({
  selector: 'app-nouvelle-cmd-clt-frs',
  templateUrl: './nouvelle-cmd-clt-frs.component.html',
  styleUrls: ['./nouvelle-cmd-clt-frs.component.scss']
})
export class NouvelleCmdCltFrsComponent implements OnInit {

  origin = '';
  selectedCat:string = 'chaine';
  selectedClientFournisseur: any = {};
  listClientsFournisseurs: Array<any> = [];
  searchedArticle: ArticleDto = {};
  Gravure: GravureDto = {};
  listArticle: Array<ArticleDto> = [];
  codeArticle = '';
  PrixVerso=false ;
  quantite = '';
  codeCommande = '';
  Livraison = ''; 
  codeSuivi= '';
  Recto= '';
  Taille=''; 
  Verso= '';
  Gauche= '';
  Droite= '';
  Note='';
  Platinage= '';
  paiement= '';
  quantiteArgent=0
  imagePath = "assets/1690634856053-360116299_663154435853664_6460113525540336672_n.jpg";

  

  lignesCommande: Array<any> = [];
  listCategories: Array<any> = [];

  totalCommande = 0;
  articleNotYetSelected = false;
  errorMsg: Array<string> = [];
  bague=false;
  chaine=false;
  Pendatif=false;
  Collier=false
 ;
  Braclet=false

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cltFrsService: CltfrsService,
    private articleService: ArticleService,
    private cmdCltFrsService: CmdcltfrsService,
    private mvtstkService:MvtstkService,
    private categoryService:CategoryService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findAllClientsFournisseurs();
    this.findAllArticles();
    this.findAllCategories()
  }
  findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories = res;
    });
  }
  cancelClick(): void {
    if (this.origin === 'client') {
      this.router.navigate(['commandesclient']);
    } else if (this.origin === 'fournisseur') {
      this.router.navigate(['commandesfournisseur']);
    }
  }
  findAllClientsFournisseurs(): void {
    if (this.origin === 'client') {
      this.cltFrsService.findAllClients()
      .subscribe((data:any) => {
        this.listClientsFournisseurs = data.clients;
        this.selectedClientFournisseur = this.listClientsFournisseurs[this.listClientsFournisseurs.length - 1];
        console.log('this.selectedClientFournisseur',data.clients        );
      });
    } else if (this.origin === 'fournisseur' ) {
      this.cltFrsService.findAllFournisseurs()
      .subscribe(fournisseurs => {
        this.listClientsFournisseurs = fournisseurs;
      });
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
    this.articleService.findAllArticlesInMvt(this.selectedCat)
    .subscribe(articles => {
      this.listArticle = articles;
      console.log('Cattt',this.listArticle)
      
    });
    

  }

  filtrerArticle(): void {
    if (this.codeArticle.length === 0) {
      this.findAllArticles();
    }
    this.listArticle = this.listArticle
    .filter(art => art.codeArticle?.includes(this.codeArticle) || art.designation?.includes(this.codeArticle));
  }

  ajouterLigneCommande(): void {
    this.checkLigneCommande();
    this.calculerTotalCommande();

    this.searchedArticle = {};
    this.quantite = '';
    this.codeArticle = '';
    this.Recto = '';
    this.Verso='';
    this.Taille='';
    this.Gauche='';
    this.Droite='';
    this.Note=''; 
    this.PrixVerso=false;
    this.quantiteArgent=0
    this.articleNotYetSelected = false;
    this.findAllArticles();
  }

  calculerTotalCommande(): void {
    this.totalCommande = 0;
    this.lignesCommande.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite ) {
        this.totalCommande += +ligne.prixUnitaire * +ligne.quantite;
      }
      if(ligne.PrixVerso && ligne.quantite && ligne.prixUnitaire){
        this.totalCommande += +ligne.quantite *5
      }
    });
  }

  private checkLigneCommande(): void {
    const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.searchedArticle.codeArticle);
    if (ligneCmdAlreadyExists) {
      this.lignesCommande.forEach(lig => {
        if (lig && lig.article?.codeArticle === this.searchedArticle.codeArticle) {
          // @ts-ignore
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
        quantite: +this.quantite  || 1,
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
    console.log('zzzz',this.searchedArticle.quantiteArgent)
    this.codeArticle = article.codeArticle ? article.codeArticle : '';
    this.articleNotYetSelected = true;
    const designation = article.category?.designation
    
  }

  enregistrerCommande(): void {
    const commande = this.preparerCommande();
    console.log('commande',commande);
    if (this.origin === 'client') {
      commande.ligneCommandeClients.forEach((ligne:any) => {
        const Mvt = this.preparerMvt(); // Create a new Mvt object for each iteration
        Mvt.article = ligne.article;
        Mvt.quantite = ligne.quantite;
        Mvt.categorie = ligne.article.category.code
        if( Mvt.categorie === 'chaine'){
          console.log('caaatttt',Mvt)
          this.mvtstkService.entreeStock(Mvt).subscribe(data => {
            console.log('entreeStock', data);
          });
        }
      });
      this.cmdCltFrsService.enregistrerCommandeClient(commande as CommandeClientDto)
      .subscribe(cmd => {
        this.router.navigate(['commandesclient']);
      }, error => {
        this.errorMsg = error.error.errors;
      });
    } else if (this.origin === 'fournisseur') { 
      console.log('fournisseur1',commande);
      commande.ligneCommandeFournisseurs.forEach((ligne:any) => {
        const Mvt = this.preparerMvt(); // Create a new Mvt object for each iteration
        Mvt.article = ligne.article;
        Mvt.quantite = ligne.quantite;
        Mvt.categorie = ligne.article.category.code
        if( Mvt.categorie === 'chaine'){
          console.log('caaatttt',Mvt)
          this.mvtstkService.entreeStock(Mvt).subscribe(data => {
            console.log('entreeStock', data);
          });
        }
        
      });
      
      this.cmdCltFrsService.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto)
      .subscribe(cmd => {

        console.log('commande',cmd);
        this.router.navigate(['commandesfournisseur']);
        console.log(cmd);

      }, error => {

        this.errorMsg = error.error.errors;

      });
    }
  }
  private preparerMvt(): any {
    console.log('preparing', this.quantite,this.searchedArticle._id);
    if (this.origin === 'client') {
      return  {
        quantite: this.quantite,
        article: this.searchedArticle._id,
        typeMvt: 'Sortie',
        sourceMvt: 'Command_Client',
      };
    } else if (this.origin === 'fournisseur') {
      console.log('Fournisseur',this.lignesCommande)

      return  {
        quantite: this.quantite,
        article: this.searchedArticle._id,
        typeMvt: 'Entree',
        sourceMvt: 'Command_Fournisseur',
      };
    }
  }
  private preparerCommande(): any {
    if (this.origin === 'client') {
      return  {
        client: this.selectedClientFournisseur,
        code: this.codeCommande,
        dateCommande: new Date().getTime(),
        etatCommande: 'Nouvelle commande',
        ligneCommandeClients: this.lignesCommande,
        Livraison:this.Livraison,
        paiement:this.paiement
        
      };
    } else if (this.origin === 'fournisseur') {
      console.log('Fournisseur',this.lignesCommande)

      return  {
        fournisseur: this.selectedClientFournisseur,
        code: this.codeCommande,
        dateCommande: new Date().getTime(),
        etatCommande: 'Commande_Fournisseur',
        ligneCommandeFournisseurs: this.lignesCommande
      };
    }
  }
}
