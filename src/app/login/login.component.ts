import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
}
const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginDetails = {username: "", password: ""}
  showError:boolean = false;

  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  loginClicked(){
    this.httpClient.post(BACKEND_URL + "/auth", this.loginDetails, httpOptions)
      .subscribe((data: any) => {
        if (data.user){
          localStorage.setItem("currentUser", data.user);
          this.showError = false;
          this.router.navigateByUrl("/");
        } else {
          this.showError = true;
        }
      })
  }

}
