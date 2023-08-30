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
import { HttpClient } from '@angular/common/http';
import { MvtStkDto } from 'src/gs-api/src/models/mvt-stk-dto';
import { AlerteService } from '../alerte/alerte.service';

@Component({
  selector: 'app-nouvelle-cmd-clt-frs',
  templateUrl: './nouvelle-cmd-clt-frs.component.html',
  styleUrls: ['./nouvelle-cmd-clt-frs.component.scss']
})
export class NouvelleCmdCltFrsComponent implements OnInit {
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
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
  disabled=false;

  codeCommande = '';
  Livraison = ''; 
  codeSuivi= '';
  Recto= '';
  Taille='';
  noteLivraison='' 
  Verso= '';
  Gauche= '';
  Droite= '';
  Note='';
  currentPage = 1;
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
  designation='';
  mvtstock:Array<any> = [];
  total: number=0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cltFrsService: CltfrsService,
    private articleService: ArticleService,
    private cmdCltFrsService: CmdcltfrsService,
    private mvtstkService:MvtstkService,
    private categoryService:CategoryService,
    private http: HttpClient,
    private alerteService:AlerteService

  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findAllCategories()
    this.findAllArticles();
    this.findAllClientsFournisseurs();


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
    console.log(`Fetching page ${this.currentPage}...`);
    const perPage = 1000; // Set your desired items per page here
  
    const url = `http://localhost:3000/api/article/all/${this.selectedCat}?page=${this.currentPage}&perPage=${perPage}&searchQuery=${this.codeArticle}`;
    this.http.get<any>(url).subscribe((data) => {
      console.log('API response:', data);
      this.listArticle = data.articles;
    });
      
      
  
    

  }

  filtrerArticle(): void {
    console.log(`Fetching page ${this.currentPage}...`);
    const perPage = 100; // Set your desired items per page here
  
    const url = `http://localhost:3000/api/article/all/${this.selectedCat}?page=${this.currentPage}&perPage=${perPage}&searchQuery=${this.codeArticle}`;
    this.http.get<any>(url).subscribe((data) => {
      console.log('API response:', data);
      this.listArticle = data.articles;
    });
  }
  filtrer(): void {
    if (this.codeArticle.length === 0) {
      this.findAllArticles();
    }
    this.currentPage=1
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
   
    if ( this.origin==='client'){
      this.lignesCommande.forEach(ligne => {
        if (ligne.prixUnitaire && ligne.quantite ) {
          this.totalCommande += +ligne.prixUnitaire * +ligne.quantite;
        }
        if(ligne.PrixVerso && ligne.quantite && ligne.prixUnitaire){
          this.totalCommande += +ligne.quantite *5
        }
      });
    }
    else if ( this.origin==='fournisseur'){
      this.lignesCommande.forEach(ligne => {
        if (ligne.prixAchat && ligne.quantite ) {
          this.totalCommande += +ligne.prixAchat * +ligne.quantite;
        }
        
      });
    
    }
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
    } else if (this.searchedArticle.codeArticle) {
      console.log("Ligne commandPrix achat",this.searchedArticle.prixAchat)
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
        prixAchat:this.searchedArticle.prixAchat,
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
      //   const Mvt = this.preparerMvt(); // Create a new Mvt object for each iteration
      //   Mvt.article = ligne.article;
      //   Mvt.quantite = ligne.quantite;
      //   Mvt.categorie = ligne.article.category.code
      //   this.mvtstock.push(Mvt);
      //   if( Mvt.categorie === 'chaine'){
      //     console.log('caaatttt',Mvt)
      //     this.mvtstkService.entreeStock(Mvt).subscribe(data => {
      //       console.log('entreeStock', data);
      //     });
         //}
         if( ligne.article.category.code === 'chaine' || ligne.article.category.code ==='Bague') {
          console.log(ligne.article._id,'ligne.article._id') 
          let total= this.calculerTotal(ligne.article._id,ligne?.article?.designation)
          console.log(total,'total') 
         }
       
       });
      this.disabled = true; // Disable the button to prevent multiple clicks

      this.cmdCltFrsService.enregistrerCommandeClient(commande as CommandeClientDto)
      .subscribe(cmd => {
        
        this.router.navigate(['commandesclient']);
      }, error => {
        this.errorMsg = error.error.errors;
      });
    } else if (this.origin === 'fournisseur') { 
      this.disabled = true; // Disable the button to prevent multiple clicks

      const commande = this.preparerCommande();
      console.log('fournisseur1',commande);
      // if(this.selectedClientFournisseur._id){
      //   commande.ligneCommandeFournisseurs.forEach((ligne:any) => {
        
      //     const Mvt = this.preparerMvt(); // Create a new Mvt object for each iteration
      //     Mvt.article = ligne.article;
      //     Mvt.quantite = ligne.quantite;
      //     Mvt.categorie = ligne.article.category.code
      //       console.log('caaatttt',Mvt)
      //       this.mvtstkService.entreeStock(Mvt).subscribe(data => {
      //         console.log('entreeStock', data);
      //       });
          
          
      //   });
      // }
      
      
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
  findMvtStock(id: any,article:any): void {
    console.log("id",id);
    this.mvtstkService.mvtStkArticle(id)
      .subscribe(list => {
        console.log('lissssst22',list);
        this.mapLignesCommande.set(id, list);
        this.mapPrixTotalCommande.set(id, this.calculerTatalCmd(list,article));
      });
  }

  calculerTatalCmd(list: Array<MvtStkDto>,article:string): number {
  
    
    
    let TotalSortie=0;
    let  TotalEntree=0
    
    list.forEach(mvt => {
      if ( mvt.quantite   ) {
        if( mvt.typeMvt==='Sortie'){
          TotalSortie+= +mvt.quantite 
        }
        else if ( mvt.typeMvt==='Entree')
        TotalEntree += +mvt.quantite 
      }
      
    });
    this.total = TotalEntree - TotalSortie
    console.log('totaaal',this.total);
     this.alerteService.setProductQuantity(this.total,article);

    return Math.floor(this.total);
  }

  calculerTotal(id?: number,article?:any): number { 
    let articles = article
    this.findMvtStock(id,article)
    return this.mapPrixTotalCommande.get(id);
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
        paiement:this.paiement,
        noteLivraison:this.noteLivraison
        
      };
    } else if (this.origin === 'fournisseur') {
      console.log('Fournisseur',this.lignesCommande)
      if(this.selectedClientFournisseur._id ) {
        console.log('Fournisseur2',this.lignesCommande)

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
}
