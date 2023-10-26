/* tslint:disable */
import { CategoryDto } from './category-dto';
import { ligneCat } from './ligneCat';
export interface ArticleDto {
  _id?: number;
  codeArticle?: string;
  designation?: string;
  prixUnitaireHt?: number;
  tauxRemise?: number;
  Remise?:number;
  prixUnitaireTtc?: number;
  photo?: string | ArrayBuffer;
  category?: CategoryDto;
  ligneCat?: Array<ligneCat>;
  quantiteArgent?:number;
  prixAchat?:string;
  idEntreprise?: string;
  description?: string;
  Disponible?:string ;
}
