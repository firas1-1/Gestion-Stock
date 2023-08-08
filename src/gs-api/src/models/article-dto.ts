/* tslint:disable */
import { CategoryDto } from './category-dto';
export interface ArticleDto {
  _id?: number;
  codeArticle?: string;
  designation?: string;
  prixUnitaireHt?: number;
  tauxRemise?: number;
  Remise?:number;
  prixUnitaireTtc?: number;
  photo?: string;
  category?: CategoryDto;
  idEntreprise?: string;
}
