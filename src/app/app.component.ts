import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'assignment';

  showNavBar: boolean = true;
  showUsers: boolean = false;

  constructor(private router: Router, private dataService: DataService) { }

  // Hide the nav bar if the player is on the login screen and hide the users nav link if they are not a super admin or group admin
  ngAfterViewChecked(): void{
    // This causes an error when in debug mode
    if (this.router.url == "/login"){
      this.showNavBar = false;
    } else{
      this.showNavBar = true;
      // Check if there is a current user and redirect to the login screen if there isn't
      let currentUser: string | null = localStorage.getItem("currentUser");
      if (!currentUser){
        this.router.navigateByUrl("/login");
        this.showUsers = false;
      } else if (!this.showUsers){
        // Show the users nav link if the user is a super admin or group admin
        this.dataService.getUserRole(currentUser).then((user: any) => {
          if (user.role == "superAdmin" || user.role == "groupAdmin"){
            this.showUsers = true;
          }
        });
      }
    }
  }

  logOut(): void{
    sessionStorage.removeItem("currentUser");
    this.router.navigateByUrl("/login");
    this.showUsers = false;
  }
}
