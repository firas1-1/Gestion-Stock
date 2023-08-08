import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { EntrepriseDto } from 'src/gs-api/src/models';
import { UtilisateursService } from 'src/gs-api/src/services';

@Component({
  selector: 'app-detail-utilisateur',
  templateUrl: './detail-utilisateur.component.html',
  styleUrls: ['./detail-utilisateur.component.scss']
})
export class DetailUtilisateurComponent implements OnInit {

  Role:string=''

  @Input()


user: EntrepriseDto = {};
@Output()
suppressionResult = new EventEmitter();
constructor(private utilisateurService:UtilisateursService,
  private userService:UserService) { }

  ngOnInit(): void {
  }
  confirmerEtSupprimer(): void {
    if( 'Admin'===this.userService.getUserRoleFromToken() ){
      this.utilisateurService.delete(this.user._id)
      .subscribe(res => {
        this.suppressionResult.emit('success');
      }, error => {
        this.suppressionResult.emit(error.error.error);
      });
    
    }  
  }
}
