import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {ArticleService} from '../../../services/article/article.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-page-article',
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.scss']
})
export class PageArticleComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 10;  
  listArticle: Array<ArticleDto> = [];
  errorMsg = '';
  totalPages: number = 10;
  codeArticle='';
  articleNotYetSelected = false;


  constructor(
    private router: Router,
    private articleService: ArticleService,
    private http : HttpClient,
    

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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post('http://localhost:3000/api/excel/import', formData).subscribe(
        () => {
          console.log('File uploaded successfully.');
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file:', error.message);
        }
      );
    }
  }
  filtrerArticle(): void {
    if (this.codeArticle.length === 0) {
      this.findListArticle();
    }
    this.currentPage=1
    this.listArticle = this.listArticle
    .filter(art => art.codeArticle?.includes(this.codeArticle) || art.designation?.includes(this.codeArticle));
  }
  handleSuppression(event: any): void {
    if (event === 'success') {
      this.articleService.findAllArticles()
      .subscribe(articles => {
        this.listArticle = articles;
      });    } else {
      this.errorMsg = event;
    }
  }
}
