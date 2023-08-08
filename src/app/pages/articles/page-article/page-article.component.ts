import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../../services/article/article.service';

@Component({
  selector: 'app-page-article',
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss']
})
export class PageArticleComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 5;  
  listArticle: Array<ArticleDto> = [];
  errorMsg = '';
  totalPages: number = 10;
  codeArticle='';
  articleNotYetSelected = false;


  constructor(
    private router: Router,
    private articleService: ArticleService
  ) { }

  ngOnInit(): void {
    this.findListArticle();
  }
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  findListArticle(): void {
    this.articleService.findAllArticles()
      .subscribe(articles => {
        this.listArticle = articles;
        this.totalPages = Math.ceil(this.listArticle.length / this.itemsPerPage);
      });
  }

  nouvelArticle(): void {
    this.router.navigate(['nouvelarticle']);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
  }
  filtrerArticle(): void {
    if (this.codeArticle.length === 0) {
      this.findListArticle();
    }
    this.listArticle = this.listArticle
    .filter(art => art.codeArticle?.includes(this.codeArticle) || art.designation?.includes(this.codeArticle));
  }
  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findListArticle();
    } else {
      this.errorMsg = event;
    }
  }
}
