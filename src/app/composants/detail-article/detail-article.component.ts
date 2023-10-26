import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArticleDto} from '../../../gs-api/src/models/article-dto';
import {Router} from '@angular/router';
import {ArticleService} from '../../services/article/article.service';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss']
})
export class DetailArticleComponent implements OnInit {

  @Input()
  articleDto: ArticleDto = {};
  @Output()
  suppressionResult = new EventEmitter();

  constructor(
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {

   
  }
  Onselect(id:any){
    this.articleService.enregistrerEtatArticle(id).subscribe(data=>{
      console.log(data);
    })
  }

  modifierArticle(): void {
    this.router.navigate(['nouvelarticle', this.articleDto._id]);
  }

  confirmerEtSupprimerArticle(): void {
    if (this.articleDto._id) {
      this.articleService.deleteArticle(this.articleDto._id)
      .subscribe(res => {
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(error.error.error);
      });
  }
  }
}
