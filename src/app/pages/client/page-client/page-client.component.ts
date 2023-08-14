import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {ClientDto} from '../../../../gs-api/src/models/client-dto';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.scss']
})
export class PageClientComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 100;  
  nom=''
  totalPages: number = 0;
  listClient: Array<ClientDto> = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService,
    private http : HttpClient
  ) { }

  ngOnInit(): void {
    this.findAllClients();
  }
  onPageChange(page: number): void {
     this.currentPage = page;
     this.findAllClients();

}


  findAllClients(): void {
    console.log(`Fetching page ${this.currentPage}...`);
    const perPage = 1; // Set your desired items per page here

      this.http.get<any>(`http://localhost:3000/api/Client/all?page=${this.currentPage}&perPage=${perPage}&nom=${this.nom}`)
      .subscribe((data) => {
        console.log('API response:', data);
        this.listClient = data.clients;
        this.currentPage = data.pagination.currentPage;
        this.totalPages = data.pagination.totalClients;
        console.log('totalPages:', this.totalPages);
      })
  }
  

  nouveauClient(): void {
    this.router.navigate(['nouveauclient']);
  }

  handleSuppression(event: any): void {
    if (event === 'success') {
      this.findAllClients();
    } else {
      this.errorMsg = event;
    }
  }
}
