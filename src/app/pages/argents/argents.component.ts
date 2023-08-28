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
  difference=0;

  constructor(
    private cmdCltFrsService: CmdcltfrsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:3000/api/ligneCommandFrs/argentQuantite/f`)
      .subscribe(  total => {
        this.totalArgent = total;
        console.log('totttttttttttttttttttttt',this.totalArgent);
        

      });
      this.http.get<any>(`http://localhost:3000/api/ligneCommand/argentQuantite/f`)
      .subscribe(  total => {
        this.totalArgentConsomee = total;
        console.log('totttttttttttttttttttttt',this.totalArgent);
        

      });
    this.fetchTotalArgentConsomee();
   // this.argentTotal();
    this.findAllCommandes();
    
  }

  fetchTotalArgentConsomee(): void {
    this.cmdCltFrsService.totalArgentConsomee().subscribe(
      total => {
        this.totalArgentConsomee = total;
        console.log('this.totalArgentConsomee.total',this.totalArgentConsomee.total);
        this.argentDisponible()
      },
      error => {
        console.error('Erreur lors de la récupération des données:', error);
      }
    );
  }
  argentDisponible(): void {
    this.difference =this.totalArgent.total - this.totalArgentConsomee.total

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

  

  

  

  findAllCommandes(): void {
    const perPage = 400; // Update with your desired value
    this.http.get<any>(`http://localhost:3000/api/command/all?page=1&perPage=${perPage}`)
      .subscribe(data => {
        this.totalCommandes = data.pagination.totalCommands;
       
      });
  }
}
