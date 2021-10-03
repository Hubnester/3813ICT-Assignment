import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'assignment';

  showNavBar: boolean = true;

  constructor(private router: Router) { }

  // Hide the logout button if hte user isn't logged in
  ngAfterViewChecked(): void{
    // This causes an error when in debug mode
    if (this.router.url == "/login"){
      this.showNavBar = false;
    } else{
      this.showNavBar = true;
    }
  }

  logOut(): void{
    sessionStorage.removeItem("currentUser");
    this.router.navigateByUrl("/login");
  }
}
