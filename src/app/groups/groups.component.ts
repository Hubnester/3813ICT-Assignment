import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  // To allow the html to access the Object functions
  Object: any = Object;
  // Variables for handling the users role
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  isGroupAssis: string[] = [];
  // Variable for the authorised channels in the authorised groups
  authorisedChannels: any = {};

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.authorisedChannels = this.dataService.getAuthorisedChannels();
  }

  // Function for deleting a group or channel
  delete(group: string, channel: string | null = null): void {
    let confirmationString: string = "";
    // Create the confirmation string based on whether a group or channel is being deleted
    if (channel){
      confirmationString = "Are you sure you want to delete the channel " + channel + " in the group " + group;
    } else {
      confirmationString = "Are you sure you want to delete the group " + group;
    }
    // Get confimation from the user
    if (confirm(confirmationString)){
      this.dataService.deleteGroupChannel(group, channel);
    }
  }
}
