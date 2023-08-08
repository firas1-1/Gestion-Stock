import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CltfrsService} from '../../../services/cltfrs/cltfrs.service';
import {ClientDto} from '../../../../gs-api/src/models/client-dto';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.scss']
})
export class PageClientComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 5;  
  totalPages: number = 0;
  listClient: Array<ClientDto> = [];
  errorMsg = '';

  constructor(
    private router: Router,
    private cltFrsService: CltfrsService
  ) { }

  ngOnInit(): void {
    this.findAllClients();
  }
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  findAllClients(): void {
    this.cltFrsService.findAllClients()
    .subscribe(clients => {
      this.listClient = clients;
      console.log(this.listClient)
      this.totalPages = Math.ceil(this.listClient.length / this.itemsPerPage);

    });
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
