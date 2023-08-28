import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {ArticlesService} from '../../../gs-api/src/services/articles.service';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {BehaviorSubject, Observable, Subject, of} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private userService: UserService,
    private articleService: ArticlesService
  ) { }
  // private productQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  // productQuantity$: Observable<number> = this.productQuantity.asObservable();

  // private minQuantity: number = 10;
  // private destroy$: Subject<void> = new Subject<void>();

 

  // setProductQuantity(quantity: number) {
  //   this.productQuantity.next(quantity);
  //   this.checkMinQuantity(quantity);
  // }

  // private checkMinQuantity(quantity: number) {
  //   this.productQuantity$
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(currentQuantity => {
  //       if (currentQuantity < this.minQuantity) {
  //         console.log('quantity', currentQuantity);

  //         this.showAlertAndAutoDismiss('Alert: Quantity is below the minimum threshold!', 10);
  //       }
  //     });
  // }

  // private showAlertAndAutoDismiss(message: string, duration: number) {
  //   alert(message);
  //   setTimeout(() => {
  //     alert('Alert dismissed.');
  //   }, duration);
  // }

  // ngOnDestroy() {
  //   this.destroy$.next();
  //   this.destroy$.complete();
  // }

  enregistrerArticle(articleDto: ArticleDto): Observable<ArticleDto> {
    const id = this.userService.getUserIdFromToken();
console.log('idididididiidididiidid', id);
    // Convert null to undefined using nullish coalescing operator ??
    const idEntreprise = id ?? undefined;
  
    // Now you can assign the value to the property without type mismatch
    articleDto.idEntreprise = idEntreprise;    

    console.log('articleDto.idEntreprise',articleDto);
    return this.articleService.save(articleDto);
  }

  findAllArticles(): Observable<ArticleDto[]> {
    return this.articleService.findAll();
  }
  findAllArticlesByCategory(cat: string): Observable<ArticleDto[]>{
    return this.articleService.findAllArticlesInMvt(cat);
  }
  findAllArticlesInMvt(code:string): Observable<ArticleDto[]> {
    return this.articleService.findAllArticlesInMvt(code);
  }

  findArticleById(idArticle?: number): Observable<ArticleDto> {
    if (idArticle) {
      return this.articleService.findById(idArticle);
    }
    return of();
  }

  deleteArticle(idArticle: number): Observable<any> {
    if (idArticle) {
      return this.articleService.delete(idArticle);
    }
    return of();
  }

  findArticleByCode(codeArticle: string): Observable<ArticleDto> {
    return this.articleService.findByCodeArticle(codeArticle);
  }
}
