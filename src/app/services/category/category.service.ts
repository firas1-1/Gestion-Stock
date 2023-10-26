import { Injectable } from '@angular/core';
import {UserService} from '../user/user.service';
import {CategoriesService} from '../../../gs-api/src/services/categories.service';
import {CategoryDto} from '../../../gs-api/src/models/category-dto';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private userService: UserService,
    private categoryService: CategoriesService,
    private http:HttpClient
  ) { }

  enregistrerCategory(categoryDto: CategoryDto): Observable<CategoryDto> {
    categoryDto.idEntreprise = this.userService.getConnectedUser()?._id;
    console.log('categoryDto.idEntreprise',categoryDto)
    return this.categoryService.save(categoryDto);
  }
  enregistrerEtatCategory(CategoryDto: CategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>("http://localhost:3000"+"/api/categorie/selected/"+CategoryDto._id,{...CategoryDto,selected:!CategoryDto.selected});
  
}
  findAll(): Observable<CategoryDto[]> {
    return this.categoryService.findAll();
  }

  findById(idCategory: number): Observable<CategoryDto> {
    return this.categoryService.findById(idCategory);
  }

  delete(idCategorie?: number): Observable<any> {
    if (idCategorie) {
      console.log('idCategorie 2',idCategorie)

      return this.categoryService.delete(idCategorie);
    }
    return of();
  }
}
