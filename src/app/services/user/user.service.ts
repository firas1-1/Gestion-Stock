import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../../gs-api/src/services/authentication.service';
import {AuthenticationRequest} from '../../../gs-api/src/models/authentication-request';
import {Observable, of} from 'rxjs';
import {AuthenticationResponse} from '../../../gs-api/src/models/authentication-response';
import {Router} from '@angular/router';
import {UtilisateursService} from '../../../gs-api/src/services/utilisateurs.service';
import {UtilisateurDto} from '../../../gs-api/src/models/utilisateur-dto';
import {retry} from 'rxjs/operators';
import {ChangerMotDePasseUtilisateurDto} from '../../../gs-api/src/models/changer-mot-de-passe-utilisateur-dto';
import { EntrepriseDto } from '../../../gs-api/src/models/entreprise-dto';
import { EntreprisesService } from '../../../gs-api/src/services/entreprises.service';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authenticationService: AuthenticationService,
    private utilisateurService: UtilisateursService,
    private entrepriseService: EntreprisesService,
    private router: Router
  ) { }


  login(authenticationRequest: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.authenticationService.authenticate(authenticationRequest);
  }

  getUserByEmail(email?: string): Observable<EntrepriseDto> {
    if (email !== undefined) {
      console.log('trueeeeeee')
      return this.entrepriseService.findByEmail(email);
    }
    console.log('falseeeeeee')

    return of();

  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    console.log('setAccessToken',  localStorage.getItem('accessToken'));

    localStorage.setItem('accessToken', JSON.stringify(authenticationResponse));
  }

  setConnectedUser(entreprise: EntrepriseDto): void {
    console.log('setConnectedUser', entreprise);
    localStorage.setItem('userId', JSON.stringify(entreprise));
    console.log('setAccessToken',  localStorage.setItem('userId', JSON.stringify(entreprise)))
  }


  getConnectedUser(): EntrepriseDto {
    console.log('getConnectedUser')
    if (localStorage.getItem(
      'userId')) {
      return JSON.parse(localStorage.getItem('userId') as string);
    }
    return {};
  }
  getUsername() {
    const token = localStorage.getItem('token');
    
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        if (decodedToken.userId) {
          return decodedToken.userId;
        }
      }
    }
    
    return null; // Return null if token is missing or doesn't contain the _id claim.
  }
  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log('Token from localStorage:', token);
  
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const decodedToken = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token:', decodedToken);
  
          if (decodedToken.userId) {
            console.log('_id claim:', decodedToken.userId);
            return  decodedToken.nom;
            ;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  
    return null; // Return null if token is missing or doesn't contain the _id claim.
  }
  getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log('Token from localStorage:', token);
  
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        try {
          const decodedToken = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token:', decodedToken);
  
          if (decodedToken.userId) {
            console.log('_id claim:', decodedToken.userId);
            return  decodedToken.Role;
            ;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  
    return null; // Return null if token is missing or doesn't contain the _id claim.
  }
  
  
  changerMotDePasse(changerMotDePasseDto: ChangerMotDePasseUtilisateurDto): Observable<ChangerMotDePasseUtilisateurDto> {
    return this.utilisateurService.changerMotDePasse(changerMotDePasseDto);
  }

  // TODO
  isUserLoggedAndAccessTokenValid(): boolean {
    if (localStorage.getItem('accessToken')) {
      console.log('userId okkk 222');

      // TODO il faut verifier si le access token est valid
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}