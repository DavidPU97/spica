import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private generalService:GeneralService) { }

  settingsForm!: FormGroup;
  submitted:boolean = false;

  ngOnInit(): void {
    this.settingsForm = this.formBuilder.group({
			cid: ['', Validators.required],
			secret: ['', Validators.required],
		});
  }

  submit(e: any){
    this.submitted = true
    if (this.settingsForm.invalid) {
			return;
    }
    this.generalService.getAuthToken(this.settingsForm.controls.cid.value, this.settingsForm.controls.secret.value).subscribe({
        next: (res:any) => {
          const now = new Date()
          console.log(res)
          console.log(now.toString())
          console.log(new Date(now.getTime() + res.expires_in * 1000).toString())
          localStorage.setItem('authToken', res.access_token);
          localStorage.setItem('authTokenExpiration', (now.getTime() + res.expires_in * 1000).toString());
          this.generalService.sendTokenBool(true)
        },
        error: (err:any) => {
          console.log(err);
				}
      }
    )

    this.submitted = false
  }

}
