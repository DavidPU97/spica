import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/user.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { GeneralService } from 'src/app/general.service';
// @ts-ignore
import { Subscription } from 'rxjs/dist/types/internal/Subscription';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, OnDestroy  {

  constructor(private generalService:GeneralService) { }

  users: User[] = [];
  columnsToDisplay = ['Name', 'Last name', 'E-mail'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

 
  dataSource!: MatTableDataSource<User>;
  usersSubscription!: Subscription
  

  ngOnInit(): void {

    this.usersSubscription = this.generalService.usersListener.subscribe((users:User[]) => {
      this.users = users
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = function (record,filter) {
        return (record.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1 || (record.lastname.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase())) > -1;
      }
      this.usersSubscription.unsubscribe();
    })
  }

  ngOnDestroy(): void {
    if(!this.usersSubscription){
      return
    }
    this.usersSubscription.unsubscribe();
  }

  convertUsers(res:any){
    this.users = [];
    res.forEach((user:any) => {
      this.users.push(new User(user.FirstName, user.LastName, user.Email))
    });
  }

  search(e: Event){
    const searchValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

}
