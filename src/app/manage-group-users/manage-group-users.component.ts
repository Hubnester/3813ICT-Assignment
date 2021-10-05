import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-manage-group-users',
  templateUrl: './manage-group-users.component.html',
  styleUrls: ['./manage-group-users.component.css']
})
export class ManageGroupUsersComponent implements OnInit {
  // To allow the html to access these functions
  Object: any = Object;
  group: string = "";
  users: any = {};

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  async ngOnInit(): Promise<void> {
    this.group = this.route.snapshot.params.group;
    this.users = await this.dataService.getAuthorisedGroupChannelUsers(this.group);
  }

}
