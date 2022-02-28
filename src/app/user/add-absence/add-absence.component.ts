import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/general.service';
import { Absence, AbsenceDefinition, User } from 'src/app/user.model';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';

@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrls: ['./add-absence.component.scss']
})
export class AddAbsenceComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private generalService:GeneralService) { }

  addAbsenceForm!: FormGroup;
  submitted:boolean = false;
  employees:User[] = [];
  absenceDefinitions: AbsenceDefinition[] = [];

  absenceDefSub!: Subscription;
  absenceAddedSub!: Subscription;

  @Output() absenceClicked = new EventEmitter<string>();

  ngOnInit(): void {
    this.addAbsenceForm = this.formBuilder.group({
			employee: ['', Validators.required],
			absence: ['', Validators.required],
      comment: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
		});

    this.absenceDefSub = this.generalService.absenceDefinitionsListener.subscribe((absencedefs:any) => {
      this.absenceDefinitions = absencedefs;
    });

    this.absenceAddedSub = this.generalService.absenceAdded.subscribe((abs:Absence) => {
      this.absenceClicked.emit("Absence added for employee "+this.employees[this.addAbsenceForm.controls.employee.value].name+".")
    })

    this.absenceDefinitions = this.generalService.getAbsenceDefinitions();
    if(this.absenceDefinitions.length == 0){
      this.generalService.fetchAbsenceDefinitions()
    }

    this.employees = this.generalService.getUsers();
    if(this.employees.length == 0){
      console.log("I should never be called?")
      let employeesSubscription: Subscription = this.generalService.usersListener.subscribe((users:User[]) => {
        this.employees = users
        employeesSubscription.unsubscribe();
      })
      this.generalService.fetchUsers();
    }
  }

  submit(e: Event){
    this.submitted = true
    console.log(this.addAbsenceForm)
    if (this.addAbsenceForm.invalid) {
			return;
    }

    let selectedUser = this.employees[this.addAbsenceForm.controls.employee.value]
    let selectedAbsence = this.absenceDefinitions[this.addAbsenceForm.controls.absence.value]

    let new_absence = new Absence(selectedAbsence.id, selectedUser.id!, this.addAbsenceForm.controls.comment.value,
      this.addAbsenceForm.controls.dateStart.value, this.addAbsenceForm.controls.dateEnd.value)
    console.log(new_absence)
    this.generalService.addAbsence(new_absence)
    this.submitted = false
  }

  ngOnDestroy(): void {
    if(!this.absenceDefSub ||!this.absenceAddedSub){
      return
    }
    this.absenceDefSub.unsubscribe();
    this.absenceAddedSub.unsubscribe();
  }
}
