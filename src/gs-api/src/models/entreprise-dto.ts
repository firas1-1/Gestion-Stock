/* tslint:disable */
import { AdresseDto } from './adresse-dto';
export interface EntrepriseDto {
  _id?: any;
  nom?: string;
  description?: string;
  adresse?: AdresseDto;
  codeFiscal?: string;
  photo?: string;
  email?: string;
  password?: string
  numTel?: string;
  steWeb?: string;
  Role?:string;
}
