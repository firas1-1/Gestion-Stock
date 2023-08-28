import { Component, OnInit } from '@angular/core';
import { AlerteService } from 'src/app/composants/alerte/alerte.service';
import { ArticleService } from 'src/app/services/article/article.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ArticleDto, CategoryDto, MvtStkDto } from 'src/gs-api/src/models';
import { MvtstkService } from 'src/gs-api/src/services';

@Component({
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.scss']
})
export class PageMvtstkComponent implements OnInit {
  listArticles: Array<ArticleDto> =[]
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
  total=0;
  codeArticle='';
  listCategories: Array<any> = [];
  ligneClient: any={};
  Cat='chaine';
  length: number=0;

  constructor(private articleService:ArticleService,private mvtstkService:MvtstkService,
    private categoryService:CategoryService,private alerteService:AlerteService) { }

  ngOnInit(): void {
    this.findAllCategories();
    this.findListArticle();

    
  }
   findAllCategories(): void {
    this.categoryService.findAll()
    .subscribe(res => {
      this.listCategories = res;
    });
  }
  selectedCat(cat:string){
    this.Cat = cat;
    this.findListArticle()
  }

  
  findListArticle(): void {
    this.articleService.findAllArticlesInMvt(this.Cat)
    .subscribe((articles:any) => {
      
      this.listArticles = articles.articles;
      console.log( 'listArticles',this.listArticles)
      this.length=this.listArticles.length

     this.findAllMvtStock()
    });
  }

  findAllMvtStock(): void {
    console.log('lis');

    this.listArticles.forEach(article => {
     this.findMvtStock(article._id,article.designation);
    });
   }
  
  // findMvtStock(){
  //   console.log( this.listArticles, 'dataaaa')

  //   this.listArticles.forEach(article => {
  //     let id :any = article._id
  //     console.log( this.listArticles, 'dataaaa')

  //      this.mvtstkService.mvtStkArticle(id).subscribe((data) => {
  //       console.log( data, 'datzzzz')
  //     });
  //   });
  
  
  // }


  
  findMvtStock(id: any,article:any): void {
    this.mvtstkService.mvtStkArticle(id)
      .subscribe(list => {
        console.log('lissssst',list);
        this.mapLignesCommande.set(id, list);
        this.mapPrixTotalCommande.set(id, this.calculerTatalCmd(list,article));
      });
  }

  calculerTatalCmd(list: Array<MvtStkDto>,article:any): number {
  
    
    
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
    console.log('totaaal',this.total,article);
    // this.alerteService.setProductQuantity(this.total,article);

    return Math.floor(this.total);
  }

  calculerTotalCommande(id?: number): number {

    return this.mapPrixTotalCommande.get(id);
  }
  filtrerArticle(): void {

    if (this.codeArticle.length === 0) {
      this.findListArticle();
    } 
    this.listArticles = this.listArticles
    .filter(art => art.codeArticle?.includes(this.codeArticle) || art.designation?.includes(this.codeArticle));
  }
}
