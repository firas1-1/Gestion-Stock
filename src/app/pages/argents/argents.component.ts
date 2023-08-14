import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountUp } from 'countup.js';
import { CmdcltfrsService } from 'src/app/services/cmdcltfrs/cmdcltfrs.service';

@Component({
  selector: 'app-argents',
  templateUrl: './argents.component.html',
  styleUrls: ['./argents.component.scss']
})
export class ArgentsComponent implements OnInit {
  @ViewChild('countUpElement') countUpElement!: ElementRef;
  @ViewChild('countUpElement1') countUpElement1!: ElementRef;
  @ViewChild('countUpElement2') countUpElement2!: ElementRef;

  countUp!: CountUp;
  countUp1!: CountUp;
  countUp2!: CountUp;

  totalCommandes: any;
  totalArgentConsomee: any;
  totalArgent: any;

  constructor(
    private cmdCltFrsService: CmdcltfrsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/ligneCommandFrs/argentQuantite/f`)
      .subscribe(  total => {
        this.totalArgent = total;
        console.log('totttttttttttttttttttttt',this.totalArgent);
        this.ngAfterViewInit1();

      });
    this.fetchTotalArgentConsomee();
   // this.argentTotal();
    this.findAllCommandes();
    
  }

  fetchTotalArgentConsomee(): void {
    this.cmdCltFrsService.totalArgentConsomee().subscribe(
      total => {
        this.totalArgentConsomee = total;
        this.ngAfterViewInit2();
      },
      error => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }

  // argentTotal(): void {
  //   this.cmdCltFrsService.totalArgent().subscribe(
  //     total => {
  //       this.totalArgent = total;
  //       this.ngAfterViewInit1();
  //     },
  //     error => {
  //       console.error('Erreur lors de la récupération des données:', error);
  //     }
  //   );
  // }

  ngAfterViewInit() {
    if (this.totalCommandes) {
      const endValue = this.totalCommandes;
      const options = {
        decimalPlaces: 0,
        suffix: '',
      };
      this.countUp = new CountUp(this.countUpElement.nativeElement, endValue, options);
      if (!this.countUp.error) {
        this.countUp.start();
      } else {
        console.error(this.countUp.error);
      }
    }
  }

  ngAfterViewInit1() {
    if (this.totalArgentConsomee) {
      const endValue = this.totalArgent.total;
      const options = {
        decimalPlaces: 0,
        suffix: ' g',
      };
      this.countUp1 = new CountUp(this.countUpElement1.nativeElement, endValue, options);
      if (!this.countUp1.error) {
        this.countUp1.start();
      } else {
        console.error(this.countUp1.error);
      }
    }
  }

  ngAfterViewInit2() {
    if (this.totalArgent && this.totalArgentConsomee) {
      const endValue = this.totalArgent.total - this.totalArgentConsomee.total;
      const options = {
        decimalPlaces: 0,
        suffix: ' g',
      };
      this.countUp2 = new CountUp(this.countUpElement2.nativeElement, endValue, options);
      if (!this.countUp2.error) {
        this.countUp2.start();
      } else {
        console.error(this.countUp2.error);
      }
    }
  }

  findAllCommandes(): void {
    const perPage = 400; // Update with your desired value
    this.http.get<any>(`http://localhost:3000/api/command/all?page=1&perPage=${perPage}`)
      .subscribe(data => {
        this.totalCommandes = data.pagination.totalCommands;
        this.ngAfterViewInit();
        this.ngAfterViewInit2();
      });
  }
}
