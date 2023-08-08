import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../../services/article/article.service';
import {ArticleDto} from '../../../../gs-api/src/models/article-dto';
import {CategoryDto} from '../../../../gs-api/src/models/category-dto';
import {CategoryService} from '../../../services/category/category.service';
import {PhotosService} from '../../../../gs-api/src/services/photos.service';
import SavePhotoParams = PhotosService.SavePhotoParams;
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nouvel-article',
  templateUrl: './nouvel-article.component.html',
  styleUrls: ['./nouvel-article.component.scss']
})
export class NouvelArticleComponent implements OnInit {
  idArticle: string = '';
  selectedFile: File | null = null;
  articleDto: ArticleDto = {};
  categorieDto: CategoryDto = {};
  listeCategorie: Array<CategoryDto> = [];
  errorMsg: Array<string> = [];
  file: File | null = null;
  imgUrl: string | ArrayBuffer = 'assets/product.png';
  Remise: boolean = false;
  TauxRemise: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private categoryService: CategoryService,
    private photoService: PhotosService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll()
    .subscribe(categories => {
      this.listeCategorie = categories;
    });

    const idArticle = this.activatedRoute.snapshot.params.idArticle;
    if (idArticle) {
      this.articleService.findArticleById(idArticle)
      .subscribe(article => {
        this.articleDto = article;
        this.categorieDto = this.articleDto.category ? this.articleDto.category : {};
      });
    }
  }

  cancel(): void {
    this.router.navigate(['articles']);
  }
 
  enregistrerArticle(): void {
    this.articleDto.category = this.categorieDto;
    console.log('gg',this.articleDto.category)
    this.articleService.enregistrerArticle(this.articleDto)
    .subscribe(art => {
      this.onSubmit(art._id);
    }, error => {
      this.errorMsg = error.error.errors;
    });
  }

  calculerTTC(): void {
    if (this.articleDto.prixUnitaireHt && this.articleDto.tauxRemise ) {
      // prixHT + (prixHT * (tauxRemise / 100))
      this.articleDto.prixUnitaireTtc =
        +this.articleDto.prixUnitaireHt - (+(this.articleDto.prixUnitaireHt * (this.articleDto.tauxRemise / 100)));
        
    } else if (this.articleDto.prixUnitaireHt && this.articleDto.Remise ){
            // ( prixHT - Remise )
            this.articleDto.prixUnitaireTtc =
              this.articleDto.prixUnitaireHt -  this.articleDto.Remise ;
    }
  }
  changeRemise(){
    this.Remise= !this.Remise
    this.TauxRemise= !this.TauxRemise
  }


  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
          }
        };
      }
    }
  }
  
  

  onSubmit(idArticle: any): void {
    if (!this.file) {
      console.log('Please select an image and enter an Article ID.');
      this.router.navigate(['articles'], );
      return;
    }
    
    const formData = new FormData();
    formData.append('image', this.file, this.file.name);
  
    this.http.post(`http://localhost:3000/api/cloudinary/upload/${idArticle}`, formData)
      .subscribe(
        (response) => {
          console.log('Image and data sent successfully!');
          // Handle the response from the backend if needed
          this.router.navigate(['articles'], );
        },
        (error) => {
          console.error('Error sending data to the server:', error);
        }
      );
  }
  savePhoto(idArticle?: number, titre?: string): void {
    if (idArticle && titre && this.file) {
      const params: SavePhotoParams = {
        id: idArticle,
        file: this.file,
        title: titre,
        context: 'article'
      };
      console.log('photo',params);
      this.photoService.savePhoto(params)
      .subscribe(res => {
        this.router.navigate(['articles'], );
      });
    } else {
      this.router.navigate(['articles']);
    }
  }
}
