import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsenceComponent } from './absence/absence.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
		path: '',
		pathMatch: 'full',
		redirectTo: 'settings',
	},
  {
		path: 'settings',
		component: SettingsComponent,
	},
  {
		path: 'users',
		component: UserComponent,
	},
  {
		path: 'absences',
		component: AbsenceComponent,
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
