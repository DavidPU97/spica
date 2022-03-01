import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';
import { Absence, AbsenceDefinition } from '../user.model';
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

  absenceDefinitions: AbsenceDefinition[] = [];
  absences: Absence[] = [];
  dataSource!: MatTableDataSource<any>;

  ngOnInit(): void {
    this.absenceDefSub = this.generalService.absenceDefinitionsListener.subscribe((absencedefs:any) => {
      this.absenceDefinitions = absencedefs;
    });

    this.absenceSub = this.generalService.absenceListener.subscribe((absences:any) => {
      this.absences = absences;
    });

    this.absenceDefinitions = this.generalService.getAbsenceDefinitions();
    if(this.absenceDefinitions.length == 0){
      this.generalService.fetchAbsenceDefinitions()
    }

    this.absences = this.generalService.getAbsences();
    if(this.absences.length == 0){
      this.generalService.fetchAbsences();
    }
    
  }

  dateChange(e: any){
    console.log(e.value)
  }

  initMatTable(){
    // this.dataSource = new MatTableDataSource<User>(this.users);
    // // this.dataSource.paginator = this.paginator;
    // this.dataSource.filterPredicate = function (record,filter) {
    //   return (record.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1 || (record.lastname.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1;
    // }
  }

  ngOnDestroy(): void {
    if(!this.absenceDefSub ||!this.absenceSub){
      return
    }
    this.absenceDefSub.unsubscribe();
    this.absenceSub.unsubscribe();
  }

}
