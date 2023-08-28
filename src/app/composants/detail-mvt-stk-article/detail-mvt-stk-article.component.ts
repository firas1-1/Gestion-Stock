import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArticleService } from 'src/app/services/article/article.service';
import { ArticleDto, LigneCommandeClientDto, MvtStkDto } from 'src/gs-api/src/models';
import { MvtstkService } from 'src/gs-api/src/services';
import { AlerteService } from '../alerte/alerte.service';

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


  totalFrs: number=0;
  etatStock=false



constructor(private articleService:ArticleService,private mvtstkService:MvtstkService,
  private route:Router,private alerteService:AlerteService) { }

ngOnInit(): void {
  console.log('quantity',this.Total)
  
  
}
correctionStock(){


}




// findListArticle(): void {
//   this.articleService.findAllArticles()
//     .pipe(
//       switchMap(articles => {
//         this.listeMvt = articles;
        
//         const observables = this.listeMvt.map(article => this.findMvtStock(article._id));
//         return forkJoin(observables);
//       })
//     )
//     .subscribe(results => {
//       console.log('Results:', results);
//       // Process the results as needed
//       this.findAllMvtStock()
//     });
// }



  // findAllMvtStock(): void {
  //   this.listeMvt.forEach(article => {
  //         console.log( 'this.listeMvt',this.listeMvt)
  //       //  this.findMvtFrsStock(article._id);

  //    this.findMvtStock(article._id);
  //   });


  // }
  
  // findMvtStock(){
  //   console.log( this.listArticles, 'dataaaa')

  //   this.listArticles.forEach(article => {
  //     let id :any = article._id
  //     console.log( this.listArticles, 'dataaaa')

  //      this.mvtstkService.mvtStkArticle(id).subscribe((data) => {
  //       console.log( data, 'datzzzz')
  //     });
  //   });
  
  
  


  // findMvtStock(id: any): void {
  //   this.mvtstkService.mvtStkArticle(id)
  //     .subscribe(list => {
  //       console.log('lissssst',list);
  //       this.mapLignesCommande.set(id, list);
  //       this.mapPrixTotalCommande.set(id, this.calculerTotalCmd(list));
  //     });
  // }
 

  
  // calculerTotalCmd(list: MvtStkDto[]): number {
  //   let totalSortie = 0;
  //   let totalEntree = 0;
  //   list.forEach(mvt => {
  //     if (mvt.quantite) {
  //       if (mvt.typeMvt === 'Sortie') {
  //         totalSortie += +mvt.quantite;
  //       } else if (mvt.typeMvt === 'Entree') {
  //         totalEntree += +mvt.quantite;
  //       }
  //     }
  //   });
  //   this.total = totalEntree - totalSortie;
  //   return Math.floor(this.total);
  // }
  
  modifierArticle(): void {
    this.route.navigate(['nouvelarticle', this.articleDto._id]);
  }
  // calculerTotalCommande(id?: number): number {


  //   if ( this.mapPrixTotalCommande.get(id)===0 || this.mapPrixTotalCommande.get(id)<0 ){
  //     this.etatStock ='Hors stock'
  //   }
  //   else if (this.total>0 ) {
  //     this.etatStock ='On stock'
  //   }
  //   return this.mapPrixTotalCommande.get(id);
  // }
  
  // calculerTotalCommande(id: any): void {
  //   const total = this.mapPrixTotalCommande.get(id) || 0;
  //   if (total <= 0) {
  //     this.etatStock=true;
  //   } else {
  //     this.etatStock=false;
  //   }
  //       return this.mapPrixTotalCommande.get(id);

  // }

}
