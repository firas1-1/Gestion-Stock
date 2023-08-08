/* tslint:disable */
import { ArticleDto } from './article-dto';
export interface LigneCommandeClientDto {
  _id?: number;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  Recto?: string;
  Verso?: string;
  Platinage?: string;
  Note?: string;
  quantiteArgent?: number;
}
