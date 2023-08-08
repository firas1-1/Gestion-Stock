import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { EntrepriseService } from 'src/app/services/entreprise/entreprise.service';
import { UserService } from 'src/app/services/user/user.service';
import { EntrepriseDto } from 'src/gs-api/src/models';
import { UtilisateursService } from 'src/gs-api/src/services';

@Component({
  selector: 'app-page-utilisateur',
  templateUrl: './page-utilisateur.component.html',
  styleUrls: ['./page-utilisateur.component.scss']
})
export class PageUtilisateurComponent implements OnInit {
  utlisateurs: Array<EntrepriseDto> = [];
  errorMsg: any;
  constructor(
    private router: Router,
    private utilisateurService: UtilisateursService,
    private userSerive: UserService,
    private entrepriseService: EntrepriseService
  ) { }

  ngOnInit(): void {
    this.entrepriseService.findAll().subscribe(res =>{
       this.utlisateurs=res
       console.log('gggggggggggggg',res);

    });
    console.log('gggggggggggggg',this.utlisateurs);
    const Role =this.userSerive.getUserRoleFromToken()
    console.log("Role",Role)
  }

  nouvelUtilosateur(): void {
    this.router.navigate(['nouvelutilisateur']);
  }
  handleSuppression(event: any): void {
    if (event === 'success') {
      this.utilisateurService.findAll().subscribe(utilisateur =>{
        this.utlisateurs=utilisateur
     });
    } else {
      this.errorMsg = event;
    }
  }
}
