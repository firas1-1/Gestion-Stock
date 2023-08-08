import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article/article.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
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
  total: number=0;
  codeArticle='';

  constructor(private articleService:ArticleService,private mvtstkService:MvtstkService) { }

  ngOnInit(): void {
    this.findListArticle()
  }
  
  

  
  findListArticle(): void {
    this.articleService.findAllArticlesInMvt('chaine')
    .subscribe((articles) => {
      
      this.listArticles = articles;
      console.log( this.listArticles)
      this.findAllMvtStock()
    });
  }

  findAllMvtStock(): void {
    this.listArticles.forEach(article => {
      
     this.findMvtStock(article._id);
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
  
  
  


  findMvtStock(id: any): void {
    
    this.mvtstkService.mvtStkArticle(id)
      .subscribe(list => {
        console.log('lissssst',list);
        this.mapLignesCommande.set(id, list);
        this.mapPrixTotalCommande.set(id, this.calculerTatalCmd(list));
      });
   
  }

  calculerTatalCmd(list: Array<MvtStkDto>): number {
  
    
    
    let TotalSortie=0;
    let  TotalEntree=0
    this.total=0
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
