import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderState } from '../loader/loader.model';

@Injectable({
  providedIn: 'root'
})
export class AlerteService {

 private productQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  productQuantity$: Observable<number> = this.productQuantity.asObservable();

  private loaderSubject = new Subject<LoaderState>();

  loaderState = this.loaderSubject.asObservable();
  private minQuantity: number = 10;
  private destroy$: Subject<void> = new Subject<void>();

 

  setProductQuantity(quantity: number,article:any) {
    this.productQuantity.next(quantity);
    this.checkMinQuantity(article);
  }

  private checkMinQuantity(article:any) {
    console.log(this.minQuantity,'1111')
    this.productQuantity$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentQuantity => {
        if (currentQuantity < this.minQuantity) {
          console.log('quantity', currentQuantity);
          this.show()
          this.showAlertAndAutoDismiss('Alert: '+article+' Quantity is below the minimum threshold!');
        }
      });
  }

  show(): void {
    console.log('state2', this.loaderSubject);
  
    this.loaderSubject.next({show: true});
  }
  
  hide(): void {
    console.log('state1', this.loaderSubject);
  
    this.loaderSubject.next({show: false});
  }
  private showAlertAndAutoDismiss(message: string) {
    
    alert(message);
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}






