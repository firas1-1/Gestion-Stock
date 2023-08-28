import { Component, OnInit } from '@angular/core';
import { AlerteService } from './alerte.service';
import { Subscription } from 'rxjs';
import { LoaderState } from '../loader/loader.model';

@Component({
  selector: 'app-alerte',
  templateUrl: './alerte.component.html',
  styleUrls: ['./alerte.component.scss']
})
export class AlerteComponent implements OnInit {

  show = false;
  subscription: Subscription | undefined;

  constructor(
    private alerteService: AlerteService
  ) { }

  ngOnInit(): void {
    console.log('state', this.subscription);
    this.subscription = this.alerteService.loaderState
    
    .subscribe((state: LoaderState) => {
      this.show = state.show;
      console.log('state', state);
    });
  }
  //       }
  //     });
  // }

  // private showAlertAndAutoDismiss(message: string, duration: number) {
  //   alert(message);
  //   setTimeout(() => {
  //     alert('Alert dismissed.');
  //   }, duration);
  // }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}


