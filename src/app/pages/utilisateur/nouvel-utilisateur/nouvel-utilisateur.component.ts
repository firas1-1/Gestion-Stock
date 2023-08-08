import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';
import { UserService } from 'src/app/services/user/user.service';
import { AdresseDto, AuthenticationRequest, EntrepriseDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-nouvel-utilisateur',
  templateUrl: './nouvel-utilisateur.component.html',
  styleUrls: ['./nouvel-utilisateur.component.scss']
})
export class NouvelUtilisateurComponent implements OnInit {

  entrepriseDto: EntrepriseDto = {};
  adresse: AdresseDto = {};
  errorsMsg: Array<string> = [];

  constructor(
    private entrepriseService: EntrepriseService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  inscrire(): void {
    this.entrepriseDto.adresse = this.adresse;
    this.entrepriseService.sinscrire(this.entrepriseDto)
    .subscribe(entrepriseDto => {
      console.log(entrepriseDto)
      this.router.navigate(['/utilisateurs']);
      
    }, error => {
      this.errorsMsg = error.error.errors;
      });
  }

  // connectEntreprise(): void {
  //   const authenticationRequest: AuthenticationRequest = {
  //     email: this.entrepriseDto.email,
  //     password: this.entrepriseDto.password   };
  //   console.log(authenticationRequest)
      
  //   this.userService.login(authenticationRequest)
  //   .subscribe(response => {
      
  //     this.userService.setAccessToken(response);
  //     //this.getUserByEmail(authenticationRequest.email);
      
  //     localStorage.setItem('origin', 'inscription');
  //     this.router.navigate(['changermotdepasse']);
  //   });
  // }

   getUserByEmail(email?: string): void {
     this.userService.getUserByEmail(email)
     .subscribe(user => {

      this.router.navigate(['utilisateurs']);
    });
   }

  cancel(): void {
    this.router.navigate(['utilisateurs']);
  }
}
