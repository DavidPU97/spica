import { Component, OnDestroy, OnInit } from '@angular/core';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';
import { GeneralService } from './general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit, OnDestroy {
  title = 'spica';
  validToken:boolean = false;
  tokenSubscription!: Subscription

  constructor(private generalService:GeneralService) { }

  ngOnInit(): void {
    this.checkToken();
    this.tokenSubscription = this.generalService.tokenValidity.subscribe({
      next: (token:boolean) => {
        this.validToken = token
        this.checkToken()
      }
    })
  }

  ngOnDestroy():void {
    if(!this.tokenSubscription){
      return
    }
    this.tokenSubscription.unsubscribe();
  }

  checkToken(){
    const tokenExpiry = localStorage.getItem('authTokenExpiration')!

    // check if acces token exists
    if (tokenExpiry) {
      const now = new Date()
      // check if the token is expired
      if (now.getTime() > parseInt(tokenExpiry)) {
        localStorage.removeItem('authTokenExpiration')
        localStorage.removeItem('authToken')
        this.validToken = false
      }
      else{
        // token is valid
        this.validToken = true
        let n: ReturnType<typeof setTimeout>;
        n = setTimeout(() => {
          this.validToken = false
          localStorage.removeItem('authTokenExpiration')
          localStorage.removeItem('authToken')
        }, parseInt(tokenExpiry)-now.getTime());
      }
    }
    else{
      // token does not exist
      console.log("No access token!")
      this.validToken = false
    }
  }
}
