import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

const SIDEARROW = ">";
const DOWNARROW = "v";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  currentUser: any = undefined;
  // Variables for handling groups
  authorisedGroups: any = [];
  showGroups: boolean = false;
  groupArrow: string = SIDEARROW;
  // Varianbles for handling channels
  authorisedChannels: any = {};
  showChannels: any = {};
  channelArrows: any = {};

  constructor(private router: Router, private dataService: DataService) { }

  async ngOnInit(): Promise<void> {
    // Check if there is a current user and redirect to the login screen if there isn't
    this.currentUser = localStorage.getItem("currentUser");
    if (!this.currentUser){
      this.router.navigateByUrl("/login");
    }
  }

  async toggleGroups(): Promise<void>{
    this.authorisedGroups = await this.dataService.getAuthorisedGroups(this.currentUser);
    // Reset the authorised channels object
    this.authorisedChannels = {};
    // Reset the show channels object
    this.showChannels = {};
    // Reset what the channel arrows look like
    this.channelArrows = {};
    for (var i in this.authorisedGroups){
      // Add the group as a key to the authorised channels
      this.authorisedChannels[this.authorisedGroups[i].name] = [];
      // Set the current group to not show the channels in the current group
      this.showChannels[this.authorisedGroups[i].name] = false;
      // Set the current arrow for the channel display buttons to the side arrow
      this.channelArrows[this.authorisedGroups[i].name] = SIDEARROW;
    }
    this.showGroups = !this.showGroups;
    if (this.showGroups){
      this.groupArrow = DOWNARROW;
    } else{
      this.groupArrow = SIDEARROW;
    }
  }

  async toggleChannels(groupName: any): Promise<void>{
    this.authorisedChannels[groupName] = await this.dataService.getAuthorisedGroupChannels(this.currentUser, groupName);
    this.showChannels[groupName] = !this.showChannels[groupName];
    if (this.showChannels[groupName]){
      this.channelArrows[groupName] = DOWNARROW;
    } else{
      this.channelArrows[groupName] = SIDEARROW;
    }
  }
}
