/* tslint:disable */
import { AdresseDto } from './adresse-dto';
export interface ClientDto {
  _id?: number;
  nom?: string;
  prenom?: string;
  adresse?: AdresseDto;
  photo?: string;
  Date?: string;
  mail?: string;
  numTel?: string;
  idEntreprise?: number;
}
