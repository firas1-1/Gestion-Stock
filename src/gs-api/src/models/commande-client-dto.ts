/* tslint:disable */
import { ClientDto } from './client-dto';
import { LigneCommandeClientDto } from './ligne-commande-client-dto';
import { MvtStkDto } from './mvt-stk-dto';
export interface CommandeClientDto {
  _id?: number;
  code?: string;
  dateCommande?: number;
  etatCommande?: 'EN_PREPARATION' | 'Terminée' | 'Production'| 'Out of delivery'| 'Annulée'|'Retournée'|'Delivered';
  client?: ClientDto;
  Livraison?: 'Retrait en Boutique' | 'Aramex' | 'BonjourExpress';
  codeSuivi?:string;
  Note?:string;
  noteLivraison?:string;
  idEntreprise?: string;
  nomEntreprise?: string;
  paiement?: string;
  ligneCommandeClients?: Array<LigneCommandeClientDto>;
  MvtStk?: Array<MvtStkDto>;

  commandeLivree?: boolean;
}
