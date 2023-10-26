import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CmdcltfrsService} from '../../services/cmdcltfrs/cmdcltfrs.service';
import {CommandeClientDto} from '../../../gs-api/src/models/commande-client-dto';
import {LigneCommandeClientDto} from '../../../gs-api/src/models/ligne-commande-client-dto';
import { UserService } from '../../services/user/user.service';
import { EntrepriseService } from '../../services/entreprise/entreprise.service';
import { MvtstkService } from 'src/gs-api/src/services/mvtstk.service';
import {  LigneCommandeFournisseurDto } from 'src/gs-api/src/models';
import { HttpClient } from '@angular/common/http';
import { param } from 'src/gs-api/src/models/param-dto';


@Component({
  
  selector: 'app-page-cmd-clt-frs',
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.scss']

})
export class PageCmdCltFrsComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 400;  
  
  totalPages: number = 400;  

  isChecked = false;

  origin = '';
  listeCommandes:  Array<any> = [];
  listefilter:  Array<any> = [];
  mapLignesCommande = new Map();
  mapCheckedComand:  Array<any> = [];
  etatChange=false;
  mapPrixTotalCommande = new Map();
  errorMsg: any;
  code = '';
  CommandeE: string=''; 
    numTel='';
  Livraison='';
  articleNotYetSelected = false;
  nomEntreprise: string | undefined;
  selectedAttribute: string='';
  filteredliste: Array<any>=[];
  filter: boolean=false;
  type: string='';
  findCommandes=false;
  commandeEtat=false;
  commandeCode=false;
  commandeNomCliet=false;
  commandeNumTel=false;
  nomClient='';
  codeSuivi='';
  etatCommande='';
  totalCommandes: any;
  totalArgentConsomee: any;
  Role: any;
  params:param={
    page: 0,
    perPage: 0,
    etatCommande:undefined,
    phoneNumber: undefined,
    nomClient: undefined,
    Livraison: undefined,
    code: undefined,
    codeSuivi: undefined
  }
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cmdCltFrsService: CmdcltfrsService,
    private userServices: UserService,
    private entrepriseService : EntrepriseService,
    private mvtstkService:MvtstkService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.Role =this.userServices.getUserRoleFromToken()
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findAllCommandes()
    this.fetchTotalArgentConsomee()

   // this.findAllCommandes();
    const id =  this.userServices.getUserIdFromToken()
  }

  
  findAllCommandes(): void {
    this.findCommandes= true;
    this.commandeEtat= false;

    console.log(`Fetching page ${this.currentPage}...`);
    const perPage = 100; // Set your desired items per page here
    if (this.origin === 'client') {
     
      this.params.page=this.currentPage
      this.params.perPage = 10


this.cmdCltFrsService.findAllCommandesClient(this.params).subscribe((data) => {
        console.log('API response:', data);
        this.listeCommandes = data.commands;
        console.log('totalPages:', this.listeCommandes);

        this.currentPage = data.pagination.currentPage;
        this.totalPages = data.pagination.totalPages;
        console.log('totalPages:', this.totalPages);
        this.listefilter = data.commands
        this.totalCommandes=data.pagination.totalCommands;

        this.findAllLignesCommande();
      });
    } else if (this.origin === 'fournisseur') {

      console.log('eeeeeemmmms', this.listeCommandes)

      this.http.get<any>(`http://localhost:3000/api/commandFrs/all?page=${this.currentPage}&perPage=${perPage}`)
      .subscribe((data) => {
              this.listeCommandes = data;
              console.log('eeeeeemmmms', this.listeCommandes)
              this.listeCommandes = data.commands;
        this.currentPage = data.pagination.currentPage;
        this.totalPages = data.pagination.totalPages;
        console.log('totalPages:', this.totalPages);
        this.totalCommandes=data.pagination.totalCommands;

        this.listefilter = data.commands
              this.findAllLignesCommande();
           });

    }
  }

  handleCheckboxChange(id: any) {
    if (this.isChecked) {
      if (!this.mapCheckedComand.includes(id)) {
        this.mapCheckedComand.push(id);
        this.etatChange = true;
      }
      this.isChecked = false; // Reset checkbox state after adding
    } else {
      const index = this.mapCheckedComand.indexOf(id);
      if (index !== -1) {
        this.mapCheckedComand.splice(index, 1); // Remove the item from the array
      }
      if (this.mapCheckedComand.length === 0) {
        this.etatChange = false;
      }
    }
  }
  CommandeEtat(){
    if (this.mapCheckedComand.length === 0) {
      console.log("No commands selected.");
      return;
    }
  
    for (let product of this.mapCheckedComand) {
      const id = product;
      let etatCommande = this.CommandeE
      this.http.put<any>(`http://localhost:3000/api/Command/etat/` + id, { etatCommande })
        .subscribe((data) => {
          console.log("Updated command:", data);
          this.CommandeE=''
          this.Refresh();
        });
    }
    this.mapCheckedComand = [];
  }
  ChangeEtatCommand(etatCommande: any) {
    if (this.mapCheckedComand.length === 0) {
      console.log("No commands selected.");
      return;
    }
  
    for (let product of this.mapCheckedComand) {
      const id = product;
      this.http.put<any>(`http://localhost:3000/api/Command/etat/` + id, { etatCommande })
        .subscribe((data) => {
          console.log("Updated command:", data);
          this.Refresh();
        });
    }
    this.mapCheckedComand = [];
  }
  
  
 onPageChange(page: number): void {

           if (this.origin === 'client') { 
            this.currentPage = page;
            console.log('currentPage:', this.currentPage);
           if ( this.findCommandes){
         this.findAllCommandes();
           }
           else if (this.commandeEtat){
            this.filtertest()

           }
     } else if (this.origin === 'fournisseur') { 
      this.currentPage = page;
      console.log('currentPage:', this.currentPage);
      
      this.findAllCommandes();
     
   //  this.filtertest()
     }   
  }
  // findAllCommandes(): void {
  //   console.log('eeeeee', this.origin);
  //   if (this.origin === 'client') {
  //     this.cmdCltFrsService.findAllCommandesClient()
  //       .subscribe(cmd => {
  //         console.log('eeeeee', cmd);
  //         this.listeCommandes = cmd;
  //         this.listefilter = this.listeCommandes
  //         console.log('ggggggggg', this.listeCommandes)
  //         this.totalPages = Math.ceil(this.listeCommandes.length / this.itemsPerPage);

  //         this.findAllLignesCommande();
  //       });
  //   } else if (this.origin === 'fournisseur') {
  //     console.log('eeeeeemmmms', this.listeCommandes)

  //     this.cmdCltFrsService.findAllCommandesFournisseur()
  //       .subscribe(cmd => {
  //         this.listeCommandes = cmd;
  //         console.log('eeeeeemmmms', this.listeCommandes)
          
  //         this.findAllLignesCommande();
  //       });
  //   }
  //}
  

  findAllLignesCommande(): void {
    this.listeCommandes.forEach(cmd => {
      
     this.findLignesCommande(cmd._id,cmd.Livraison,cmd.remiseCommande);
     console.log('entrepriseee',cmd.idEntreprise);
    });
  }
  
  nouvelleCommande(): void {
    if (this.origin === 'client') {
      this.router.navigate(['nouvellecommandeclt']);
    } else if (this.origin === 'fournisseur') {
      this.router.navigate(['nouvellecommandefrs']);
    }
  }
  
 

  findLignesCommande(idCommande: number,Livraison:string,remise:number): void {
    if (this.origin === 'client') {
      this.cmdCltFrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => {
        console.log('lissssst',list);
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list,Livraison,remise));
      });
    } else if (this.origin === 'fournisseur') {
      console.log('lissssst',idCommande)
      this.cmdCltFrsService.findAllLigneCommandesFournisseur(idCommande)
      .subscribe(list => {
        console.log('lissssst',list);
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list,Livraison,remise),);
        console.log('lissssst',this.mapLignesCommande);

      });
    }
  }
  calculerTatalCmdFrs(list: Array<LigneCommandeClientDto>,Livraison:string): number {
    console.log('livraiosn', Livraison)
    
    let total = 0;
    list.forEach(ligne => {
      if (ligne.prixAchat && ligne.quantite   ) {
        total += +ligne.quantite * +ligne.prixAchat;
      }
      
    });
    if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
      total += 7
    }
    return Math.floor(total);
  }
  calculerTatalCmd(list: Array<LigneCommandeClientDto>,Livraison:string,remise:number): number {
    console.log('livraiosn', Livraison)
    
    let total = 0;
    if ( this.origin==='client'){
      list.forEach(ligne => {
        if (ligne.prixUnitaire && ligne.quantite   ) {
          total += +ligne.quantite * +ligne.prixUnitaire;
        }
        if(ligne.PrixVerso && ligne.quantite && ligne.prixUnitaire){
          total += +ligne.quantite *5
        }
      });
      
      if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
        total += 7
      }
      if ( typeof(remise)==='number'){
      total = total + remise
      }
      
      
    
    
    } else if ( this.origin==='fournisseur'){
      console.log('1')
      list.forEach(ligne => {
        if (ligne.prixAchat && ligne.quantite   ) {
          total += +ligne.quantite * +ligne.prixAchat;
        }
        if(ligne.PrixVerso && ligne.quantite && ligne.prixAchat){
          total += +ligne.quantite *5
        }
      });
      
      if ( Livraison==='Aramex' || Livraison==='BonjourExpress'){
        total += 7
      }
    }
    return Math.floor(total);
    
    }
    
  
  calculerTotalCommande(id?: number): number {

    return this.mapPrixTotalCommande.get(id);
  }
 
  filterCommandeEtat(etatCommande:string){
    this.etatCommande=etatCommande
    this.currentPage=1
    this.filtertest()
  }
  fetchTotalArgentConsomee(): void {
    this.cmdCltFrsService.totalArgentConsomee().subscribe(
      total => {
        this.totalArgentConsomee = total;
        console.log('Total Argent Consommé:', this.totalArgentConsomee); // Utilisez totalArgentConsomee ici
      },
      error => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }
  
  Refresh(){
    if (this.etatChange ){
      this.etatChange=!this.etatChange
    }
    this.ngOnInit()
  }
  filtertest() {
     
    const Livraison = this.Livraison
    this.commandeEtat= true;
this.findCommandes=false
if ( this.Livraison){
  this.params.Livraison=this.Livraison

}
if ( this.nomClient){
  this.params.nomClient=this.nomClient

}
if ( this.numTel){
  this.params.phoneNumber=this.numTel
}
if ( this.etatCommande){
  this.params.etatCommande=this.etatCommande
}
if ( this.code){
  this.params.code=this.code
}
if ( this.codeSuivi){
  this.params.codeSuivi=this.codeSuivi
}
this.params.perPage=1
    const perPage = 1; // Set your desired items per page here
    // this.currentPage=1
    this.cmdCltFrsService.findAllCommandesClient(this.params).
    subscribe((data) => {
      console.log('API response:', data);
     
      this.listeCommandes = data.commands;
      this.currentPage = data.pagination.currentPage;
      this.totalPages = data.pagination.totalPages;
      this.totalCommandes=data.pagination.totalCommands;
      console.log('totalPages:', this.totalPages);
      this.findAllLignesCommande();
      
    });
  }
  
  
  
  
  
  
  
  
  
      

  
  
  filtrerCommandby(filterValuee: Event,number:string): void {
    
    const filterValue = (filterValuee.target as HTMLInputElement).value.trim();
      console.log('fcodddddddddddddddddeee',filterValue);
      const perPage = 1; // Set your desired items per page here

      if (filterValue.length === 0) {
        this.findAllCommandes();
      } else
        if (this.origin === 'client') {
          this.listeCommandes=this.listefilter
          
          console.log('jnjnjjnjne',filterValue);
          if ( number ==='1'){
            this.commandeCode=false
            this.commandeEtat=false
            this.commandeNomCliet=false
            this.commandeNumTel=true
            // this.cmdCltFrsService.findAllCommandesClient().subscribe(data=>{
            //   this.listeCommandes=data
            // });
            this.listeCommandes = this.listeCommandes.filter((commande: CommandeClientDto) => {
              return commande.client?.numTel && commande.client?.numTel.includes(filterValue); // Check if commande.code is defined before filtering
            });
            console.log('xxxxxe',this.listeCommandes);
          } else if ( number ==='2'){
            this.commandeCode=false
            this.commandeEtat=false
            this.commandeNomCliet=true
            this.commandeNumTel=false
            this.http.get<any>(`http://localhost:3000/api/command/nomClient/${filterValue}?page=${this.currentPage}&perPage=${perPage}`)
            .subscribe((data) => {
              console.log('API response:', data);
              this.listeCommandes = data.commands;
              this.currentPage = data.pagination.currentPage;
              this.totalPages = data.pagination.totalPages;
              console.log('totalPages:', this.totalPages);
              this.findAllLignesCommande();
            });
            this.listeCommandes = this.listeCommandes.filter((commande: CommandeClientDto) => {
              return commande.client?.nom && commande.client?.nom.includes(filterValue);
             // Check if commande.code is defined before filtering
            });
            console.log('xxxxxe',this.listeCommandes);
          } else if ( number ==='3'){
            this.listeCommandes = this.listeCommandes.filter((commande: CommandeClientDto) => {
              return commande.codeSuivi && commande.codeSuivi.includes(filterValue);
             // Check if commande.code is defined before filtering
            });
            console.log('xxxxxe',this.listeCommandes);
          }
         
        } else if (this.origin === 'fournisseur') {
          
            this.listeCommandes = this.listeCommandes.filter((commande: CommandeClientDto) => {
              return commande.client?.numTel && commande.client?.numTel.includes(filterValue); // Check if commande.code is defined before filtering
            });
            this.findAllLignesCommande();
          
        }
      
    }
  
  
  
  
  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllCommandes();
    } else {
      this.errorMsg = event;
    }
  }
}
