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
    this.httpClient.post(BACKEND_URL + "/api/auth", this.loginDetails, httpOptions)
      .subscribe((data: any) => {
        if (data.valid){
          sessionStorage.setItem("userData", JSON.stringify(data));
          this.showError = false;
        } else {
          this.showError = true;
        }
      })
  }

}
