import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser:any = undefined;
  data: any = undefined;

  constructor(private router: Router, private dataService: DataService) { }

  async ngOnInit(): Promise<void> {
    // Check if there is a current user and redirect to the login screen if there isn't
    this.currentUser = "temp for testing" //localStorage.getItem("currentUser");
    if (!this.currentUser){
      this.router.navigateByUrl("/login");
    }

    var data:object = await this.dataService.getData();
    console.log(data);
  }

}
