/* tslint:disable */
import { FournisseurDto } from './fournisseur-dto';
import { LigneCommandeFournisseurDto } from './ligne-commande-fournisseur-dto';
export interface CommandeFournisseurDto {
  _id?: number;
  code?: string;
  dateCommande?: number;
  etatCommande?: 'EN_PREPARATION' | 'Terminée' | 'Production'| 'Out of delivery'| 'Annulée'|'Retournée'|'Delivered';
  fournisseur?: FournisseurDto;
  Livraison?: 'Retrait en Boutique' | 'Aramex' | 'BonjourExpress';
  codeSuivi?:number;
  idEntreprise?: string;
  nomEntreprise?: string;
  ligneCommandeClients?: Array<LigneCommandeFournisseurDto>;
  commandeLivree?: boolean;
}
