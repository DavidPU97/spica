import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';
import { Absence, AbsenceDefinition, User } from '../user.model';
import { MatTableDataSource } from '@angular/material/table';


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
  table: {employee:string, absence: string}[] = []
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.absenceDefSub = this.generalService.absenceDefinitionsListener.subscribe((absencedefs:any) => {
      this.absenceDefinitions = absencedefs;
      this.absenceDefSub.unsubscribe();
    });

    this.absenceSub = this.generalService.absenceListener.subscribe((absences:any) => {
      this.absences = absences;
      this.absenceSub.unsubscribe();
    });

    this.usersSubscription = this.generalService.usersListener.subscribe((employees:User[]) => {
      this.employees = employees
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

    this.employees = this.generalService.getUsers()
    if(this.employees.length == 0){
      this.generalService.fetchUsers()
    }
    
  }

  dateChange(e: any){
    let selectedDate = e.value.setHours(0, 0, 0, 0)
    console.log(selectedDate)
    console.log(new Date(this.absences[56].dateStart).setHours(0, 0, 0, 0))
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
    console.log(this.absencesSelected)
  }

  initMatTable(){
    // this.dataSource = new MatTableDataSource<User>(this.users);
    // // this.dataSource.paginator = this.paginator;
    // this.dataSource.filterPredicate = function (record,filter) {
    //   return (record.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1 || (record.lastname.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1;
    // }
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
