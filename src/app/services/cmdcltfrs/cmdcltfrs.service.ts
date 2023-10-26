import { Injectable } from '@angular/core';
import {CommandesclientsService} from '../../../gs-api/src/services/commandesclients.service';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CommandeFournisseurDto} from '../../../gs-api/src/models/commande-fournisseur-dto';
import {CommandefournisseurService} from '../../../gs-api/src/services/commandefournisseur.service';
import {UserService} from '../user/user.service';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import {LigneCommandeFournisseurDto} from '../../../gs-api/src/models/ligne-commande-fournisseur-dto';
import { EntrepriseService } from '../entreprise/entreprise.service';
import { HttpClient } from '@angular/common/http';
import { param } from 'src/gs-api/src/models/param-dto';

@Injectable({
  providedIn: 'root'
})
export class CmdcltfrsService {
  
  
  findAll() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/api/ligneCommand/argentQuantite/f'; // Replace with your API URL


  constructor(
    private commandeClientService: CommandesclientsService,
    private commandeFournisseurService: CommandefournisseurService,
    private userService: UserService,
    private entrepriseService:EntrepriseService,
    private http: HttpClient
  ) { }

  
  enregistrerCommandeClient(commandeClient: CommandeClientDto): Observable<CommandeClientDto> {
    const id:any = this.userService.getUserIdFromToken();
   console.log  ( id, ' id userrr')
    // Convert null to undefined using nullish coalescing operator ??
    const idEntreprise = id ?? undefined;
    commandeClient.idEntreprise = idEntreprise ;  

   
    return this.commandeClientService.save(commandeClient);
  }
  updateLigne(Ligne:LigneCommandeClientDto): Observable<CommandeClientDto> {
    const id:any = this.userService.getUserIdFromToken();
   console.log  ( id, ' id userrr')
    // Convert null to undefined using nullish coalescing operator ??
    const idEntreprise = id ?? undefined;

   
    return this.commandeClientService.updateLigne(Ligne);
  }
  
  enregistrerCommandeFournisseur(commandeFournisseurDto: CommandeFournisseurDto): Observable<CommandeFournisseurDto> {
    console.log('2',commandeFournisseurDto)
    //commandeFournisseurDto.idEntreprise = this.userService.getConnectedUser()._id;
    return this.commandeFournisseurService.save(commandeFournisseurDto);
  }

  findAllCommandesClient(paramtre:param): Observable<any> {
    console.log('tessst')
    return this.commandeClientService.findAll(paramtre);
  }

  totalArgentConsomee(): Observable<Number> {
    console.log('tessst')
    return this.http.get<number>(`${this.apiUrl}`);
  }

  
  totalArgent(): Observable<Number> {
    console.log('tessst')
    return this.http.get<number>(`http://localhost:3000/api/ligneCommandFrs/argentQuantite/f`);
  }
  

  findAllCommandesClientbyid(idCmd:number): Observable<CommandeClientDto> {
    console.log('tessst')
    return this.commandeClientService.findById(idCmd);
  }


  findAllCommandesFournisseur(): Observable<CommandeFournisseurDto[]> {
    return this.commandeFournisseurService.findAll();
  }


  findAllLigneCommandesClient(idCmd?: number): Observable<LigneCommandeClientDto[]> {
    if (idCmd) {
     
      return this.commandeClientService.findAllLignesCommandesClientByCommandeClientId(idCmd);
    }
    return of();
  }

  deleteCmdFrs(idCommand: number): Observable<any> {
    if (idCommand) {
      return this.commandeFournisseurService.delete(idCommand);
    }
    return of();
  }
  deleteArticle(idArticle: number): Observable<any> {
    if (idArticle) {
      return this.commandeClientService.delete(idArticle);
    }
    return of();
  }
  deleteLigneCommand(idLigne: number): Observable<any> {
    if (idLigne) {
      return this.commandeClientService.deleteLigne(idLigne);
    }
    return of();
  }

  findAllLigneCommandesFournisseur(idCmd?: number): Observable<LigneCommandeFournisseurDto[]> {
    if (idCmd) {
      return this.commandeFournisseurService.findAllLignesCommandesFournisseurByCommandeFournisseurId(idCmd);
    }
    return of();
  }
  findAllCommandesbyidEntreprise(idEntreprise?: string): Observable<CommandeClientDto[]> {
    if (idEntreprise) {
      return this.commandeClientService.findAllCommandesbyidEntreprise(idEntreprise);
    }
    return of();
  }
}
