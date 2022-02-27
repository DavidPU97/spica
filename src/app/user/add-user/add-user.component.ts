import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/general.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {


  constructor(private formBuilder: FormBuilder, private generalService:GeneralService) { }

  addUserForm!: FormGroup;
  submitted:boolean = false;

  ngOnInit(): void {
    this.addUserForm = this.formBuilder.group({
			name: ['', Validators.required],
			lastname: ['', Validators.required],
      email: ['', Validators.required],
		});
  }

  submit(e: any){
    this.submitted = true
    if (this.addUserForm.invalid) {
			return;
    }
    let new_user = new User(this.addUserForm.controls.name.value, this.addUserForm.controls.lastname.value, this.addUserForm.controls.email.value)
    this.generalService.addUser(new_user)
    // this.generalService.pushUser(new_user)
    this.submitted = false
  }
}
