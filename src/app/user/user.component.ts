import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
import { User } from '../user.model';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(private generalService:GeneralService) { }

  alert: boolean = false;
  users: User[] = []

  usersSubscription!:Subscription

  ngOnInit(): void {
    this.usersSubscription = this.generalService.usersListener.subscribe((users:User[]) => {
      this.users = users
    })
    this.users = this.generalService.getUsers()
    if(this.users.length == 0){
      this.generalService.fetchUsers()
    }
  }

  ngOnDestroy():void {
    if(!this.usersSubscription){
      return
    }
    this.usersSubscription.unsubscribe();
  }

  getUsers(){
    console.log(this.users)
  }

  

}
