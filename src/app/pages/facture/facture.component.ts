import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { CommandeClientDto } from '../../../gs-api/src/models/commande-client-dto';
import { ClientDto } from '../../../gs-api/src/models/client-dto';
import { CltfrsService } from '../../services/cltfrs/cltfrs.service';
import { PhotosService } from '../../../gs-api/src/services/photos.service';
import { CmdcltfrsService } from '../../services/cmdcltfrs/cmdcltfrs.service';
import { AdresseDto } from '../../../gs-api/src/models/adresse-dto';
import { ArticleDto } from '../../../gs-api/src/models/article-dto';
import { ArticleService } from '../../services/article/article.service';
import { LigneCommandeClientDto } from '../../../gs-api/src/models/ligne-commande-client-dto';
import { CommandeFournisseurDto } from '../../../gs-api/src/models/commande-fournisseur-dto';
import { GravureDto } from 'src/gs-api/src/models/Gravure-dto';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {
  @Input()
  origin = '';
  @Input()

 Command: any = {};
  ClientDto: ClientDto = {};
  adresseDto: AdresseDto = {};

  errorMsg: Array<string> = [];
  file: File | null = null;
  selectedClientFournisseur: any = {};
  listClientsFournisseurs: Array<any> = [];
  searchedArticle: ArticleDto = {};
  listArticle: Array<ArticleDto> = [];
  codeArticle = '';
  quantite = '';
  code = '';
  Recto = '';
  Verso = '';
  Droite='';
  Gauche = '';
  Taille=''; 
  Platinage = '';
  Note = '';
  quantiteArgent=0;
  mapLignesCommande = new Map();
  mapPrixTotalCommande = new Map();

  lignesCommande: Array<any> = [];
  totalCommande = 0;
  articleNotYetSelected = false;
  idCommand: any;
  TotalCommande=0;



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private CmdcltfrsService: CmdcltfrsService,
    private articleService: ArticleService)
    {}

  ngOnInit(): void {
    const idClient = this.activatedRoute.snapshot.params.idObject;
    console.log('idClient',idClient);
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findObject();
    this.findAllLignesCommande();
    this.ajouterLigneCommande()
  }

  
  public downloadInvoice(){

    const doc = new jsPDF();
    const code = this.Command.code;
    const date = this.Command.dateCommande
    const Livraison = this.Command.livraison
    const total = this.calculerTotalCommande(this.Command._id)
    const nomClient = this.ClientDto.nom ? this.ClientDto.nom : '' +' '+ this.ClientDto.prenom ? this.ClientDto.prenom : '' 
    const adresse1 = this.adresseDto.adresse1 ? this.adresseDto.adresse1 : ''
    
    const adresse2 = this.adresseDto.adresse2 ? this.adresseDto.adresse2 : ''
    const ville = this.adresseDto.ville ? this.adresseDto.ville: ''
    const numTel = this.ClientDto.numTel
    const body: any[][] = [];

    this.lignesCommande.forEach(item => {
      const rowData = [
        item.article?.designation,
        item.quantite, // You may replace this with actual data
        item.prixUnitaire ? item.prixUnitaire + 'Dnt'  : '',         // You may replace this with actual data
        item.PrixVerso? item.quantite * item.prixUnitaire +  item.quantite * 5 : item.quantite * item.prixUnitaire  + 'Dnt' // You may replace this with actual data
      ];

      body.push(rowData);
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Rimes Bijoux',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff'
            }
          },
          {
            content: 'Invoice',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff'
            }
          }
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#3366ff'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            
            content: 'Reference: #'+ code 
            +'\nDate: ' + date
            +'\nInvoice number: ' + code ,
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          { 
            content: 'Billed to:'
            +'\n'+nomClient
            +'\n'+ adresse1
            +'\n' + adresse2
            +'\n' + ville
            +'\nTunisie',
            styles: {
              halign: 'left'
            }
          },
         
          {
            content: 'From:'
            +'\nRimes Bijoux '
            +'\nRue Boughdir'
          
            +'\n8000 Nabeul'
            +'\nTunisie',
            styles: {
              halign: 'right'
            }
          }
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Amount due:',
            styles: {
              halign:'right',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: total + ' Dnt',
            styles: {
              halign:'right',
              fontSize: 20,
              textColor: '#3366ff'
            }
          }
        ],
       
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Products & Services',
            styles: {
              halign:'left',
              fontSize: 14
            }
          }
        ]
      ],
      theme: 'plain'
    });
    const remiseCommande = this.Command.remiseCommande;
    
    autoTable(doc, {
      head: [['Items', 'Quantity', ' unit Price', 'Amount']],
      body: body,

      theme: 'striped',
      headStyles:{
        fillColor: '#343a40'
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Subtotal:',
            styles:{
              halign:'right'
            }
          },
          {
            content: total + 'Dnt',
            styles:{
              halign:'right'
            }
          },
        ],
        [
          {
            content: 'TAX:',
            styles:{
              halign:'right'
            }
          },
          {
            content: '0' + 'Dnt',
            styles:{
              halign:'right'
            }
          },
        ],
        [
          {
            content: 'Total amount:',
            styles:{
              halign:'right'
            }
          },
          {
            content: total + 'Dnt',
            styles:{
              halign:'right'
            }
          },
        ],
      ],
      theme: 'plain'
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Terms & notes',
            styles: {
              halign: 'left',
              fontSize: 14
            }
          }
        ],
        [
          {
            content: 'Chers clients fidèles, le paiement sera effectué lors de la livraison.'
           ,
            styles: {
              halign: 'left'
            }
          }
        ],
      ],
      theme: "plain"
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Rimes - Bijoux de Créateur',
            styles: {
              halign: 'center'
            }
          }
        ]
      ],
      theme: "plain"
    });

    return doc.save("invoice");

  }


  findAllArticles(): void {
    this.articleService.findAllArticles()
    .subscribe(articles => {
      this.listArticle = articles;
    });
  }


  findObject(): void {
    const id = this.activatedRoute.snapshot.params.id;
    console.log(id)
    if (id) {
      
        console.log('client')
        this.CmdcltfrsService.findAllCommandesClientbyid(id)
        .subscribe(command => {
          console.log('command1',command)
          this.Command = command;
          this.idCommand=this.Command._id
          this.ClientDto = this.Command.client;
          this.adresseDto = this.Command.client.adresse
          console.log('client+adresse0',this.Command.dateCommande);

        });
    }
  }


  cancelClick(): void {
      this.router.navigate(['commandesclient']);
  }


  mapToCommand():CommandeClientDto {
    const commandeDto: CommandeClientDto = this.Command;
    commandeDto.client = this.ClientDto;
    console.log('client+adresse',commandeDto);
    return commandeDto;
  }

  ajouterLigneCommande(): void {
    console.log(this.lignesCommande,'ligneCommand22')
    this.checkLigneCommande();
    this.calculerTotalCommande();
    this.searchedArticle = {};
    this.quantite = '';
    this.codeArticle = '';
    this.Recto='';
    this.Verso='';
    this.Platinage='';
    this.Note='';


    this.articleNotYetSelected = false;
    this.findAllArticles();
  }

  // calculerTotalCommande(): void {
  //   this.totalCommande = 0;
  //   console.log('calculerTotalCommande')
  //   this.lignesCommande.forEach(ligne => {
  //     if (ligne.prixUnitaire && ligne.quantite) {
  //       console.log('calculerTotalCommande',ligne.prixUnitaire)

  //       this.totalCommande += +ligne.prixUnitaire * +ligne.quantite;
        
  //     }
  //   });
  // }

  private checkLigneCommande(): void {
    const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.searchedArticle.codeArticle);
    if (ligneCmdAlreadyExists) {
      this.lignesCommande.forEach(lig => {
        if (lig && lig.article?.codeArticle === this.searchedArticle.codeArticle) {
          // @ts-ignore&
          lig.quantite = lig.quantite + +this.quantite;
        }
      });
    }else {
      const Gravure:GravureDto={
        Recto: this.Recto,
        Verso: this.Verso,
        Droite: this.Droite,
        Gauche: this.Gauche
      }
      const ligneCmd: LigneCommandeClientDto = {
        article: this.searchedArticle,
        Gravure: Gravure,
        Platinage:this.Platinage,
        Taille:this.Taille,
        Note: this.Note,
        prixUnitaire: this.searchedArticle.prixUnitaireTtc,
        quantite: +this.quantite,
        quantiteArgent:this.quantiteArgent
      };
      this.lignesCommande.push(ligneCmd);
    }
  }

  selectArticleClick(article: ArticleDto): void {
    console.log('seArticle', article);
    this.searchedArticle = article;
    this.codeArticle = article.codeArticle ? article.codeArticle : '';
    this.articleNotYetSelected = true;
  }
  supprimerArticle(){
console.log('supprimerArticle', );
  }
  
  findAllLignesCommande(): void {
    const id = this.activatedRoute.snapshot.params.id;

     this.findLignesCommande(id);
     console.log(id)
   
  }

  

  findLignesCommande(idCommande?: number): void {
    console.log('list');
      this.CmdcltfrsService.findAllLigneCommandesClient(idCommande)
      .subscribe(list => { 
        list.forEach(listItem => {
          this.lignesCommande.push(listItem);
        }
        )
        console.log(this.lignesCommande,'ligneCommand')
        console.log('list1',list);
        this.mapLignesCommande.set(idCommande, list);
        this.mapPrixTotalCommande.set(idCommande, this.calculerTatalCmd(list));
      });
  }


  calculerTatalCmd(list: Array<LigneCommandeClientDto>): number {
    let total = 0;
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite && !ligne.PrixVerso) {
        total += +ligne.quantite * +ligne.prixUnitaire;
      }
      
     else  if(ligne.PrixVerso && ligne.quantite && ligne.prixUnitaire){
        total += +ligne.quantite *5
      }
      console.log('total1',total);
    });
    
    
    return Math.floor(total);
  }
  calculerTotalCommande(id?: number): number {
    const livraison = this.Command.Livraison;
    const remise = this.Command.remiseCommande;
    const prixTotal = this.mapPrixTotalCommande.get(id);
  
    if (typeof remise === 'number') {
      return livraison === 'Retrait en Boutique' ? prixTotal + remise : prixTotal + 7 + remise;
    }
  
    return livraison === 'Retrait en Boutique' ? prixTotal : prixTotal + 7;
  
    
  
    // Ajoutez une valeur de retour par défaut si nécessaire
    return 0; // Par exemple, 0 si aucune condition n'est satisfaite
  }

  

  

 
  

  handleSuppression(event: any): void {
    if (event === 'success') {
      let id = this.activatedRoute.snapshot.params.id
      

      window.location.reload();

    } else {
      this.errorMsg = event;
    }
  }

   
}

  