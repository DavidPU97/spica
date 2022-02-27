import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private generalService:GeneralService) { }

  ngOnInit(): void {
  }

  getUsers(){
    this.generalService.fetchUsers().subscribe({
      next: (res:any) => {
        console.log(res)
      }
    })
  }

}
