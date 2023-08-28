import { Component, Input, OnInit } from '@angular/core';
import { MvtStkDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-mvt-stk',
  templateUrl: './detail-mvt-stk.component.html',
  styleUrls: ['./detail-mvt-stk.component.scss']
})
export class DetailMvtStkComponent implements OnInit {

  @Input()
  MvtStock: any = {};


  constructor() { }

  ngOnInit(): void {
    console.log(this.MvtStock.quantite,'MvtStock.quantite')
  }

}
