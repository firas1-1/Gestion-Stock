/* tslint:disable */
import { Category } from './category';
import { LigneVente } from './ligne-vente';
import { LigneCommandeClient } from './ligne-commande-client';
import { LigneCommandeFournisseur } from './ligne-commande-fournisseur';
import { MvtStk } from './mvt-stk';
import { ligneCat } from './ligneCat';

export interface Article {
  _id?: number;
  creationDate?: number;
  lastModifiedDate?: number;
  codeArticle?: string;
  designation?: string;
  prixUnitaireHt?: number;
  tauxRemise?: number;
  Remise?:number;
  prixUnitaireTtc?: number;
  photo?: string;
  idEntreprise?: number;
  category?: Category;
  ligneCat?: Array<ligneCat>;

  ligneVentes?: Array<LigneVente>;
  ligneCommandeClients?: Array<LigneCommandeClient>;
  ligneCommandeFournisseurs?: Array<LigneCommandeFournisseur>;
  mvtStks?: Array<MvtStk>;
}
