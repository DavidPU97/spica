import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
// import { User } from '../user.model';
// // @ts-ignore
// import { Subscription } from 'rxjs/dist/types/internal/Subscription';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(private generalService:GeneralService) { }

  addUser: boolean = false;
  addAbsence: boolean = false;
  positiveFeedback: String = "";
  // alert: boolean = false;
  // users: User[] = []

  // usersSubscription!:Subscription

  ngOnInit(): void {


  }

  userFun(event: string){
    this.addUser=false
    this.positiveFeedback = event;
  }

  absenceFun(event: string){
    this.addAbsence=false
    this.positiveFeedback = event;
  }

  ngOnDestroy():void {
    // if(!this.usersSubscription){
    //   return
    // }
    // this.usersSubscription.unsubscribe();
  }



  

}
