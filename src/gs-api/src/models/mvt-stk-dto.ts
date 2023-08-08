/* tslint:disable */
import { ArticleDto } from './article-dto';
export interface MvtStkDto {
  id?: number;
  dateMvt?: number;
  quantite?: number;
  article?: ArticleDto;
  typeMvt?: 'Entree' | 'Sortie' | 'CORRECTION_POS' | 'CORRECTION_NEG';
  sourceMvt?: 'COMMANDE_CLIENT' | 'COMMANDE_FOURNISSEUR' | 'VENTE';
  idEntreprise?: number;
}
