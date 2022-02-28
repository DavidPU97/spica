import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/general.service';
import { User } from 'src/app/user.model';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {


  constructor(private formBuilder: FormBuilder, private generalService:GeneralService) { }

  addUserForm!: FormGroup;
  
  submitted:boolean = false;
  alertMessage:string = ""

  userAddedSubscription!: Subscription
  errorSub!: Subscription

  @Output() userClicked = new EventEmitter<string>();

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
			name: ['', Validators.required],
			lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
		});

    this.userAddedSubscription = this.generalService.userAdded.subscribe((user:User) => {
      this.userClicked.emit("User "+user.name+" "+user.lastname+" added.")
    });

    this.errorSub = this.generalService.errorListener.subscribe((error:string) => {
      this.alertMessage = error
    });
  }

  submit(e: any){
    this.submitted = true
    this.alertMessage = ""
    if (this.addUserForm.invalid) {
			return;
    }
    let new_user = new User(this.addUserForm.controls.name.value, this.addUserForm.controls.lastname.value, this.addUserForm.controls.email.value)
    this.generalService.addUser(new_user)
    this.submitted = false
  }

  ngOnDestroy(): void {
    if(!this.userAddedSubscription ||!this.errorSub){
      return
    }
    this.errorSub.unsubscribe();
    this.userAddedSubscription.unsubscribe();
  }
}
