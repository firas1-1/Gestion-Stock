import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {AuthenticationRequest} from '../../../gs-api/src/models/authentication-request';
import {Router} from '@angular/router';
import {debug} from 'ng-packagr/lib/util/log';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit {

  authenticationRequest: AuthenticationRequest = {};
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  login() {
    this.userService.login(this.authenticationRequest).subscribe((data) => {
      console.log('authenticationRequest 1',this.authenticationRequest)
      this.userService.setAccessToken(data);
      this.getUserByEmail();
      this.router.navigate(['']);
    }, error => {
      this.errorMessage = 'Login et / ou mot de passe incorrecte';
    });
  }

  getUserByEmail(): void {
    console.log('login',this.authenticationRequest.email)

    this.userService.getUserByEmail(this.authenticationRequest.email)
    .subscribe(user => {
      console.log('userrrrrr',user);
      this.userService.setConnectedUser(user);
    });
  }

}
