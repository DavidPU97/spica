import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-token-alert',
  templateUrl: './token-alert.component.html',
  styleUrls: ['./token-alert.component.scss']
})
export class TokenAlertComponent implements OnInit {

  constructor() { }

  @Input() validToken!:boolean

  ngOnInit(): void {
  }

}
