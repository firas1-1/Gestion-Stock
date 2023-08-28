import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {LoaderState} from '../loader.model';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show(): void {
    console.log('state2', this.loaderSubject);

    this.loaderSubject.next({show: true});
  }

  hide(): void {
    console.log('state1', this.loaderSubject);

    this.loaderSubject.next({show: false});
  }
}
