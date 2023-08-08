import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { CommandeClientDto } from '../../../gs-api/src/models/commande-client-dto';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';
import {  ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-page-statistiques',
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.scss']
})
export class PageStatistiquesComponent implements OnInit {
   listeCommandes : Array<CommandeClientDto> = [];
   deliveredCommand : Array<CommandeClientDto> = [];
   RetourCommand : Array<CommandeClientDto> = [];
   deliveredAramexCommands: Array<CommandeClientDto> = [];
   deliveredBonjourCommands : Array<CommandeClientDto> = [];
  nbCommandes=0;
  numberOfLivreeCommandes=0;
  numberOfLivreeTerminee=0;
  numberOfLivreeRetournee =0;
  numberOfLivreeAnnulee =0;
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();
  total: number=0;
  currentDate: Date = new Date(); // Current date
  numberOfLivreeDelivered=0;
  totalDeliveredCommand: number=0;
  username: any;
  BBoutique=false;
  LLivraison=false;
  totalDeliveredCommandAramex=0;
  nbCommandAramex=0;
  nbCommandBonjour=0;
  totalDeliveredCommandBonjour=0;
  constructor( private userService: UserService,
    private cmdcltfrs: CmdcltfrsService,
    private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {

     const id : any =this.userService.getUserIdFromToken()
     console.log('id ',id )
     this.username = id

     this.cmdcltfrs.findAllCommandesbyidEntreprise(id).subscribe(commandes => {
      // Filter commandes that have etatCommande === 'livree'
      this.nbCommandes = commandes.length
      this.listeCommandes = commandes.filter(commande => commande.etatCommande === 'EN_PREPARATION');
    
      // Get the number of commandes with etatCommande === 'livree'
      this.numberOfLivreeCommandes = this.listeCommandes.length;
      console.log('Number of livree commandes:', this.numberOfLivreeCommandes);
      this.listeCommandes=commandes
      this.listeCommandes = commandes.filter(commande => commande.etatCommande === 'Terminée');
    
      // Get the number of commandes with etatCommande === 'livree'
      this.numberOfLivreeTerminee = this.listeCommandes.length;
      console.log('Number of livree commandes:', this.numberOfLivreeTerminee);
      this.listeCommandes=commandes
    //Bonjour
      this.deliveredBonjourCommands = commandes.filter(
        commande => commande.etatCommande === 'Delivered' && commande.Livraison === 'BonjourExpress'
      );
      this.nbCommandBonjour = this.deliveredBonjourCommands.length
      console.log('Bonjourrrrrrr:', this.nbCommandBonjour );

      // Get the number of commandes with etatCommande === 'livree'
      this.deliveredAramexCommands = commandes.filter(
        commande => commande.etatCommande === 'Delivered' && commande.Livraison === 'Aramex'
      );
      this.nbCommandAramex = this.deliveredAramexCommands.length
      console.log('nbCommandArssamex:', this.nbCommandAramex);

      this.deliveredCommand= commandes.filter(commande => commande.etatCommande === 'Delivered');
      this.numberOfLivreeDelivered = this.deliveredCommand.length;
      console.log('Number of livree commandes:', this.numberOfLivreeDelivered);
      console.log('Number of deliveries:', this.deliveredCommand)
      this.listeCommandes=commandes
      this.listeCommandes = commandes.filter(commande => commande.etatCommande === 'Retournée');
    
      // Get the number of commandes with etatCommande === 'livree'
      this.numberOfLivreeRetournee = this.listeCommandes.length;
      console.log('Number of livree commandes:', this.numberOfLivreeRetournee);
      this.listeCommandes=commandes
      this.listeCommandes = commandes.filter(commande => commande.etatCommande === 'Annulée');
    
      // Get the number of commandes with etatCommande === 'livree'
      this.numberOfLivreeAnnulee = this.listeCommandes.length;
      console.log('numberOfLivreeAnnulee:', this.numberOfLivreeAnnulee);
      this.listeCommandes=commandes

      this.findAllLignesCommande();
      this.findAllLignesDeliveredCommande();


    });
    
  }

  Boutique(){
    this.BBoutique=true;
    this.LLivraison=false;

  }
  Livraison(){
    this.totalDeliveredCommandAramex=0
    this.totalDeliveredCommandBonjour=0;
    this.LLivraison=true;
    this.BBoutique=false;
    this.findAllLignesDeliveredCommandeAramex()
    this.findAllLignesDeliveredCommandeBonjour()

  }

  findAllLignesDeliveredCommandeBonjour(): void {
    console.log('nbbbbaramex',this.deliveredAramexCommands)
    this.deliveredBonjourCommands.forEach(cmd => {
      let id:any= cmd._id;
      let Livraison:any = cmd.Livraison;
     this.findLignesDeliveredCommandeBonjour(id,Livraison);
     console.log('entrepriseee',id,cmd.Livraison);
    });
  }

  findLignesDeliveredCommandeBonjour(idCommande: number,Livraison:string): void {
    this.cmdcltfrs.findAllLigneCommandesClient(idCommande)
    .subscribe(list => {
      this.mapLignesCommande.set(idCommande, list);
      this.mapPrixTotalCommande.set(idCommande, this.calculerTatalDeliveredCmdBonjour(list,Livraison));
    });

} 
calculerTatalDeliveredCmdBonjour(list: Array<LigneCommandeClientDto>,Livraison:string): number {
  console.log('livraiosn', Livraison)
  let initialTotal= 0
  list.forEach(ligne => {
    if (ligne.prixUnitaire && ligne.quantite   ) {
      initialTotal += +ligne.quantite * +ligne.prixUnitaire;
    }
  });
  if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
    initialTotal += 7
  }
  console.log('totaaassssssssssssssssssssssssl',this.totalDeliveredCommandAramex)
  this.totalDeliveredCommandBonjour += initialTotal 
  return Math.floor(this.total);
}



  findAllLignesDeliveredCommandeAramex(): void {
    console.log('nbbbbaramex',this.deliveredAramexCommands)
    this.deliveredAramexCommands.forEach(cmd => {
      let id:any= cmd._id;
      let Livraison:any = cmd.Livraison;
     this.findLignesDeliveredCommandeAramex(id,Livraison);
     console.log('entrepriseee',id,cmd.Livraison);
    });
  }

  findLignesDeliveredCommandeAramex(idCommande: number,Livraison:string): void {
    this.cmdcltfrs.findAllLigneCommandesClient(idCommande)
    .subscribe(list => {
      this.mapLignesCommande.set(idCommande, list);
      this.mapPrixTotalCommande.set(idCommande, this.calculerTatalDeliveredCmdAramex(list,Livraison));
    });

} 
calculerTatalDeliveredCmdAramex(list: Array<LigneCommandeClientDto>,Livraison:string): number {
  console.log('livraiosn', Livraison)
  let initialTotal= 0
  list.forEach(ligne => {
    if (ligne.prixUnitaire && ligne.quantite   ) {
      initialTotal += +ligne.quantite * +ligne.prixUnitaire;
    }
  });
  if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
    initialTotal += 7
  }
  console.log('totaaassssssssssssssssssssssssl',this.totalDeliveredCommandAramex)
  this.totalDeliveredCommandAramex += initialTotal 
  return Math.floor(this.total);
}

  findAllLignesDeliveredCommande(): void {
    this.deliveredCommand.forEach(cmd => {
      let id:any= cmd._id;
      let Livraison:any = cmd.Livraison;
     this.findLignesDeliveredCommande(id,Livraison);
     console.log('entrepriseee',id,cmd.Livraison);
    });
  }
  findLignesDeliveredCommande(idCommande: number,Livraison:string): void {

    this.cmdcltfrs.findAllLigneCommandesClient(idCommande)
    .subscribe(list => {
      this.mapLignesCommande.set(idCommande, list);
      this.mapPrixTotalCommande.set(idCommande, this.calculerTatalDeliveredCmd(list,Livraison));
    });
}

calculerTatalDeliveredCmd(list: Array<LigneCommandeClientDto>,Livraison:string): number {
  console.log('livraiosn', Livraison)
  let initialTotal= 0
  list.forEach(ligne => {
    if (ligne.prixUnitaire && ligne.quantite   ) {
      initialTotal += +ligne.quantite * +ligne.prixUnitaire;
    }
  });
  if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
    initialTotal += 7
  }
  console.log('totaaal',this.total)
  this.totalDeliveredCommand += initialTotal 
  return Math.floor(this.total);
}

calculerTotalDeliveredCommande(id?: number): number {

  return this.mapPrixTotalCommande.get(id);
}
  findAllLignesCommande(): void {
    this.listeCommandes.forEach(cmd => {
      let id:any= cmd._id;
      let Livraison:any = cmd.Livraison;
     this.findLignesCommande(id,Livraison);
     console.log('entrepriseee',id,cmd.Livraison);
    });
  }
  findLignesCommande(idCommande: number,Livraison:string): void {

      this.cmdcltfrs.findAllLigneCommandesClient(idCommande)
      .subscribe(list => {
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list,Livraison));
      });
  
  }
  calculerTatalCmd(list: Array<LigneCommandeClientDto>,Livraison:string): number {
    console.log('livraiosn', Livraison)
    let initialTotal= 0
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite   ) {
        initialTotal += +ligne.quantite * +ligne.prixUnitaire;
      }
    });
    if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
      initialTotal += 7
    }
    console.log('totaaal',this.total)
    this.total += initialTotal 
    return Math.floor(this.total);
  }

  calculerTotalCommande(id?: number): number {

    return this.mapPrixTotalCommande.get(id);
  }

}
