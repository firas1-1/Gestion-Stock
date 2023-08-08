import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {UtilisateurDto} from '../../../gs-api/src/models/utilisateur-dto';
import { EntrepriseDto } from '../../../gs-api/src/models/entreprise-dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  connectedUser: EntrepriseDto = {};
  username: any;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.connectedUser = this.userService.getConnectedUser();
    console.log(this.connectedUser)
    const id : any =this.userService.getUserIdFromToken()
    this.username=id
    console.log('id ',id )
  }

}
