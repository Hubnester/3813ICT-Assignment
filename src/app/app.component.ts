import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'assignment';

  showLogout: boolean = true;

  constructor(private router: Router) { }

  // Hide the logout button if hte user isn't logged in
  ngAfterViewChecked(): void{
    // TODO: Fix error this causes
    if (this.router.url == "/login"){
      this.showLogout = false;
    } else{
      this.showLogout = true;
    }
  }

  logOut(): void{
    sessionStorage.removeItem("currentUser");
    this.router.navigateByUrl("/login");
  }
}
