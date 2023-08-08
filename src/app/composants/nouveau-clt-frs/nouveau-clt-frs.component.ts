import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientDto} from '../../../gs-api/src/models/client-dto';
import {AdresseDto} from '../../../gs-api/src/models/adresse-dto';
import {CltfrsService} from '../../services/cltfrs/cltfrs.service';
import {FournisseurDto} from '../../../gs-api/src/models/fournisseur-dto';
import {PhotosService} from '../../../gs-api/src/services/photos.service';
import SavePhotoParams = PhotosService.SavePhotoParams;
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nouveau-clt-frs',
  templateUrl: './nouveau-clt-frs.component.html',
  styleUrls: ['./nouveau-clt-frs.component.scss']
})
export class NouveauCltFrsComponent implements OnInit {

  origin = '';

  clientFournisseur: any = {};
  listeClient:Array<ClientDto> = [];
  adresseDto: AdresseDto = {};
  errorMsg: Array<string> = [];
  file: File | null = null;
  searchedArticle: ClientDto = {};
  articleNotYetSelected = false;


  imgUrl: string | ArrayBuffer = 'assets/product.png';
  update: boolean=false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltFrsService: CltfrsService,
    private photoService: PhotosService,
    private http: HttpClient
    
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data.origin;
    });
    this.findObject();
    this.finAllClients()
  }

  findObject(): void {
    const id = this.activatedRoute.snapshot.params.id;
    if (id) {
      if (this.origin === 'client') {
        this.update=true
        console.log(this.update,'updateeee')
        this.cltFrsService.findClientById(id)
        .subscribe(client => {
          this.clientFournisseur = client;
          this.adresseDto = this.clientFournisseur.adresse;
          console.log('client+adresse0',this.adresseDto,this.clientFournisseur);

        });
      } else if (this.origin === 'fournisseur') {
        this.cltFrsService.findFournisseurById(id)
        .subscribe(fournisseur => {
          this.clientFournisseur = fournisseur;
          this.adresseDto = this.clientFournisseur.adresse;
          console.log('client+adresse0',this.adresseDto,this.clientFournisseur);
        });
      }
    }
  }

  enregistrer(): void {
    if (this.origin === 'client') {
      this.cltFrsService.enregistrerClient(this.mapToClient())
      .subscribe(client => {
        this.savePhoto(client._id,);
      }, error => {
        this.errorMsg = error.error.errors;
      });
    } else if (this.origin === 'fournisseur') {
      console.log('fournisseur',this.clientFournisseur)
      this.cltFrsService.enregistrerFournisseur(this.mapToFournisseur())
      .subscribe(fournisseur => {
        this.savePhoto(fournisseur._id,);
      }, error => {
        this.errorMsg = error.error.errors;
      });
    }
  }
  finAllClients(): void {
    console.log('eeeeee', this.origin);
  
    if (this.origin === 'client') {
      this.cltFrsService.findAllClients()
        .subscribe(cmd => {
          console.log('eeeeee', cmd);
          this.listeClient = cmd;
          console.log('eeeeee', cmd);
          
  
        });
    } else if (this.origin === 'fournisseur') {
      this.cltFrsService.findAllFournisseurs()
        .subscribe(cmd => {
          // this.clientFournisseur = cmd;
          
        });
    }
  }
  filtrerArticle(): void {
    console.log('selectednumTel', this.clientFournisseur.numTel);

    if (this.clientFournisseur.numTel.length === 0) {
      this.finAllClients();
    }

    this.listeClient = this.listeClient
      .filter(art => art.numTel?.includes(this.clientFournisseur.numTel) || art.numTel?.includes(this.clientFournisseur.numTel));
    }

  selectArticleClick(client: ClientDto): void {
    console.log('selectedArticle', client);
    this.searchedArticle = client;
    this.clientFournisseur.numTel = client.numTel ? client.numTel : '';
    this.articleNotYetSelected = true;
    
    this.clientFournisseur.nom=this.listeClient[0].nom;
    this.clientFournisseur.prenom=this.listeClient[0].prenom;
    this.clientFournisseur.mail=this.listeClient[0].mail;

  }
  
  cancelClick(): void {
    if (this.origin === 'client') {
      this.router.navigate(['clients']);
    } else if (this.origin === 'fournisseur') {
      this.router.navigate(['fournisseurs']);
    }
  }

  mapToClient(): ClientDto {
    const clientDto: ClientDto = this.clientFournisseur;
    clientDto.adresse = this.adresseDto;
    console.log('client+adresse',clientDto);
    return clientDto;
  }

  mapToFournisseur(): FournisseurDto {
    const fournisseurDto: FournisseurDto = this.clientFournisseur;
    fournisseurDto.adresse = this.adresseDto;
    return fournisseurDto;
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
      if (this.file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload = (event) => {
          if (fileReader.result) {
            this.imgUrl = fileReader.result;
          }
        };
      }
    }
  }

  savePhoto(idCltFrs?: any): void {
    if (this.origin === 'client') {
    if (!this.file) {
      if ( this.update==true ) {  
        this.router.navigate(['clients'], );
        console.log('ffffffffffff',this.update)
        return; 

      }

      console.log('Please select an image and enter an CLient ID.');
      this.router.navigate(['nouvellecommandeclt'])
      return; 


    }
    
    const formData = new FormData();
    formData.append('image', this.file, this.file.name);
  
    this.http.post(`http://localhost:3000/api/cloudinary/upload/client/${idCltFrs}`, formData)
      .subscribe(
        (response) => {
          console.log('Image and data sent successfully!');
          // Handle the response from the backend if needed
      if ( this.update==true ) { 
        this.router.navigate(['clients'], );
        return; 


      }
          this.router.navigate(['nouvellecommandeclt'], );
          return; 


        },
        (error) => {
          console.error('Error sending data to the server:', error);
        }
      );
      }
    
    else if (this.origin === 'fournisseur') {

      if (!this.file) {
        console.log('Please select an image and enter an CLient ID.');
        return;
      }
      
      const formData = new FormData();
      formData.append('image', this.file, this.file.name);
    
      this.http.post(`http://localhost:3000/api/photoClient/upload/${idCltFrs}`, formData)
        .subscribe(
          (response) => {
            console.log('Image and data sent successfully!');
            // Handle the response from the backend if needed
            this.router.navigate(['nouvellecommandeclt'], );
          },
          (error) => {
            console.error('Error sending data to the server:', error);
          }
        );

    }

    
  }

}
