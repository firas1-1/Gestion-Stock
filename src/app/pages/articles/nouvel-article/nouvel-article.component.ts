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
  images:any
  Allimage=false;
  file: File | null = null;
  file1: File | null = null;
  file2: File | null = null;
  file3: File | null = null;
  file6: File | null = null;

  update: boolean = false;



  imgUrl: string | ArrayBuffer = 'assets/product.png';
  Remise: boolean = false;
  TauxRemise: boolean = true;
  imgUrl1: string | ArrayBuffer = 'assets/product.png'
  imgUrl2: string | ArrayBuffer = 'assets/product.png'
  imgUrl3: string | ArrayBuffer = 'assets/product.png'
  imgUrl15: string | ArrayBuffer = 'assets/product.png'
  currentImageID: any;
  currentImg: any;

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
        this.imagesProduct(this.articleDto._id)

      });
    }
  }

  cancel(): void {
    this.router.navigate(['articles']);
  }
 
  imagesProduct(id:any){
    console.log('images', id)

    this.http.get<any>(`http://localhost:3000/api/article/images/${id}`)
    .subscribe((data) => {
      this.images=data
      if (this.images.length >=3 ){
        this.Allimage=true
      }
      console.log('images', this.images)
         });
  }
  OnSaveImages(id: any) {
    const filesToUpload = [this.file1, this.file2, this.file3];
    console.log(filesToUpload, '111)');
    
    const uploadRecursive = (index: number) => {
      const file = filesToUpload[index];
  
      if (file) {
        console.log(file, '222)');
  
        const formData = new FormData();
        formData.append('image', file, file.name);
        console.log(file, file.name,'333)');
        
        this.http.post(`http://localhost:3000/api/cloudinary/create/${id}/?index=${index}`, formData)
          .subscribe(
            (response) => {
              console.log(`Image ${index + 1} and data sent successfully!`);
              // Handle the response from the backend if needed
  
              // Move to the next iteration
              uploadRecursive(index + 1);
            },
            (error) => {
              console.error(`Error sending data for image ${index + 1} to the server:`, error);
  
              // Move to the next iteration
              uploadRecursive(index + 1);
            }
          );
      } else {
        // All iterations are completed
        this.router.navigate(['articles']);
      }
    };
  
    // Start the loop with index 0
    uploadRecursive(0);
  }
  
  
  enregistrerArticle(): void {
    this.articleDto.category = this.categorieDto;
    console.log('gg',this.articleDto.category)
    this.articleService.enregistrerArticle(this.articleDto)
    .subscribe(art => {
      this.OnSaveImages(art._id);
      this.updateImage()
      this.onSubmit(art._id);
    },error => {
      this.errorMsg = error.error;
      console.log('error',  this.errorMsg);

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
  onFileInput6(files: FileList | null): void {
    if (files) {
      this.file6 = files.item(0);
      if (this.file6) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file6);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl15 = fileReader.result;
          }
        };
      }
    }
  }
  
  onFileInput1(files: FileList | null): void {
    if (files) {
      this.file1 = files.item(0);
      if (this.file1) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file1);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl1 = fileReader.result;
          }
        };
      }
    }
  }
  onFileInput3(files: FileList | null): void {
    if (files) {
      this.file3 = files.item(0);
      if (this.file3) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file3);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl3 = fileReader.result;
          }
        };
      }
    }
  }
 
  getimgID(id:any,img:any){
    this.currentImg=img
    this.update=true
    this.currentImageID=id
  }
  updateImage(){
    let id = this.currentImageID;
    if (!this.file6) {
      console.log('Please select an image and enter an Article ID.');
      this.router.navigate(['articles'], );
      return;
    }
    const formData = new FormData();
    formData.append('image', this.file6, this.file6.name);
  
    this.http.put(`http://localhost:3000/api/cloudinary/selectImage/${id}`, formData)
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
  onFileInput2(files: FileList | null): void {
    if (files) {
      this.file2 = files.item(0);
      if (this.file2) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file2);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl2 = fileReader.result;
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
