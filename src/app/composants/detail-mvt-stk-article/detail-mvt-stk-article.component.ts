import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article/article.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { MvtstkService } from 'src/gs-api/src/services';

@Component({
  selector: 'app-detail-mvt-stk-article',
  templateUrl: './detail-mvt-stk-article.component.html',
  styleUrls: ['./detail-mvt-stk-article.component.scss']
})
export class DetailMvtStkArticleComponent implements OnInit {
  listeMvt: Array<any> = [];
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
  quantite:number=0;
@Input()
articleDto: ArticleDto = {};
@Input()
Total= 0;
  total: number=0;



constructor(private articleService:ArticleService,private mvtstkService:MvtstkService) { }

ngOnInit(): void {
  this.findListArticle()
 

}
correctionStock(){


}




findListArticle(): void {
  this.articleService.findAllArticles()
  .subscribe(articles => {
    this.listeMvt = articles;
    console.log( this.listeMvt)
    this.findAllMvtStock()
  });
}



  findAllMvtStock(): void {
    this.listeMvt.forEach(article => {
      
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

}
