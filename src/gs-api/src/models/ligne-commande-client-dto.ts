import { ArticleDto } from './article-dto';
import { GravureDto } from './Gravure-dto'; // Update the import statement to match the correct file name

export interface LigneCommandeClientDto {
  _id?: number;
  article?: ArticleDto;
  quantite?: number;
  prixUnitaire?: number;
  Gravure?: GravureDto;
  Platinage?: string;
  Note?: string;
  Taille?: string;
  PrixVerso?: boolean;
  quantiteArgent?: number;
  prixAchat?: string;
}