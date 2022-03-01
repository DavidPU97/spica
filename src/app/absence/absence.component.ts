import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';
import { Absence, AbsenceDefinition, User } from '../user.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent implements OnInit, OnDestroy {

  constructor(private generalService:GeneralService) { }

  absenceDefSub!: Subscription
  absenceSub!: Subscription
  usersSubscription!: Subscription

  absenceDefinitions: AbsenceDefinition[] = [];
  absences: Absence[] = [];
  absencesSelected: Absence[] = [];
  employees: User[] = [];
  table: {employee:string, absence: string, comment: string, returnsIn: string}[] = []
  dataSource!: MatTableDataSource<any>;

  // today: Date = new Date()
  today = new FormControl(new Date());

  columnsToDisplay = ['Employee', 'Absence', 'Comment', 'ReturnsIn'];

  ngOnInit(): void {
    this.absenceDefSub = this.generalService.absenceDefinitionsListener.subscribe((absencedefs:any) => {
      this.absenceDefinitions = absencedefs;
      if(this.employees.length != 0 && this.absences.length != 0){
        console.log("absenceDef call")
        this.dateChange(this.today)
      }
      this.absenceDefSub.unsubscribe();
    });

    this.absenceSub = this.generalService.absenceListener.subscribe((absences:any) => {
      this.absences = absences;
      if(this.employees.length != 0 && this.absenceDefinitions.length != 0){
        console.log("absence call")
        this.dateChange(this.today)
        console.log(this.today)
      }
      // this.absenceSub.unsubscribe();
    });

    this.usersSubscription = this.generalService.usersListener.subscribe((employees:User[]) => {
      this.employees = employees
      if(this.absences.length != 0 && this.absenceDefinitions.length != 0){
        console.log("employee call")
        this.dateChange(this.today)
      }
      this.usersSubscription.unsubscribe();
    })

    this.absenceDefinitions = this.generalService.getAbsenceDefinitions();
    if(this.absenceDefinitions.length == 0){
      this.generalService.fetchAbsenceDefinitions()
    }

    this.absences = this.generalService.getAbsences();
    if(this.absences.length == 0){
      this.generalService.fetchAbsences();
    }
    else{
      console.log("in get absences")
      this.dateChange(this.today)
    }

    this.employees = this.generalService.getUsers()
    if(this.employees.length == 0){
      this.generalService.fetchUsers()
    }
  }

  dateChange(e: any){
    this.table = [];

    let selectedDate = e.value.setHours(0, 0, 0, 0)
    this.absencesSelected = this.absences.filter(absence => {
      if(absence.dateStart && absence.dateEnd){
        let startDate = new Date(absence.dateStart).setHours(0, 0, 0, 0)
        let endDate = new Date(absence.dateEnd).setHours(0, 0, 0, 0)
        if(selectedDate >= startDate && selectedDate <= endDate){
          return true;
        }
      }
      return false;
    })

    this.absencesSelected.forEach(absence => {
      let employee = this.employees.find(e => e.id == absence.employeeId)
      let absenceName = this.absenceDefinitions.find(ab => ab.id == absence.absenceId)?.name
      this.table.push({
        employee: employee?.name + ' '+ employee?.lastname,
        absence: absenceName!,
        comment: absence.comment,
        returnsIn: Math.ceil((Math.abs(new Date(absence.dateEnd).setHours(0, 0, 0, 0) - selectedDate)/1000/3600/24)).toString()
      })
    });
    console.log(this.absencesSelected)
    console.log(this.table)
    this.initMatTable()
  }

  initMatTable(){
    this.dataSource = new MatTableDataSource<{employee:string, absence: string, comment: string, returnsIn: string}>(this.table);
  }

  refresh(){
    this.generalService.fetchAbsences();
  }

  ngOnDestroy(): void {
    if(!this.absenceDefSub ||!this.absenceSub || !this.usersSubscription){
      return
    }
    this.usersSubscription.unsubscribe();
    this.absenceDefSub.unsubscribe();
    this.absenceSub.unsubscribe();
  }

}
