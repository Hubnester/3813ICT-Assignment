import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';    // Replaced with multiple other components (remove after fully replaced)
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [{path: "old", component: HomeComponent}, {path: "", component: GroupsComponent}, {path: "login", component: LoginComponent}, {path: "users", component: UsersComponent}, {path: "profile", component: ProfileComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
