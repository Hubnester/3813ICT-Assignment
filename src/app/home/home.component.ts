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
  // Variables for handling the users role
  isSuperAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  groupAssisFor: any = {};
  isGroupAssis: any = {};
  // Variables for handling groups
  authorisedGroups: any = [];
  showGroups: boolean = false;
  groupArrow: string = SIDEARROW;
  // Varianbles for handling channels
  authorisedChannels: any = {};
  showChannels: any = {};
  channelArrows: any = {};
  // Variables for handling channel edit display
  showChannelEdits: any = {};
  channelEditArrows: any = {};
  // Variables for new groups and channels
  newGroupName: string = "";
  newChannelNames: any = {};

  constructor(private router: Router, private dataService: DataService) { }

  async ngOnInit(): Promise<void> {
    // Check if there is a current user and redirect to the login screen if there isn't
    this.currentUser = localStorage.getItem("currentUser");
    if (!this.currentUser){
      this.router.navigateByUrl("/login");
    }
    var userRole: any = await this.dataService.getUserRole(this.currentUser);
    this.groupAssisFor = userRole.groupAssisFor;
    // Set the permissions based on the role (the fall through is intentional due to roles inheriting the abilities of the ones below)
    switch (userRole.role){
      case "superAdmin":
        this.isSuperAdmin = true;
      case "groupAdmin":
        this.isGroupAdmin = true;
    }
  }

  // Toggle the visibility of groups the user is a member of
  async toggleGroups(): Promise<void>{
    this.authorisedGroups = await this.dataService.getAuthorisedGroups(this.currentUser);
    // Reset the authorised channels object
    this.authorisedChannels = {};
    // Reset the other show variables
    this.showChannels = {};
    this.showChannelEdits = {};
    // Reset what the other show arrows look like
    this.channelArrows = {};
    this.channelEditArrows = {};
    // Reset the new channel names
    this.newChannelNames = {};
    for (var i in this.authorisedGroups){
      // Add the group as a key to the authorised channels
      this.authorisedChannels[this.authorisedGroups[i]] = [];
      // Set the current group to not show the channels in the current group
      this.showChannels[this.authorisedGroups[i]] = false;
      this.showChannelEdits[this.authorisedGroups[i]] = {};
      // Set the current arrow for the channel display buttons to the side arrow
      this.channelArrows[this.authorisedGroups[i]] = SIDEARROW;
      this.channelEditArrows[this.authorisedGroups[i]] = {};
      // Set the new channel names as empty string
      this.newChannelNames[this.authorisedGroups[i]] = "";
      // Set the user as group assistant for the group
      if (this.isGroupAdmin){
        // Group admins and super admins are automatically group assistants
        this.isGroupAssis[this.authorisedGroups[i]] = true;
      } else{
        for (var j in this.groupAssisFor){
          if (this.groupAssisFor[j] == this.authorisedGroups[i]){
            this.isGroupAssis[this.authorisedGroups[i]] = true;
          }
        }
      }
    }
    this.showGroups = !this.showGroups;
    if (this.showGroups){
      this.groupArrow = DOWNARROW;
    } else{
      this.groupArrow = SIDEARROW;
    }
  }

  // Toggle the visibility of the channels the user has access to
  async toggleChannels(groupName: any): Promise<void>{
    this.authorisedChannels[groupName] = await this.dataService.getAuthorisedGroupChannels(this.currentUser, groupName);
    this.showChannels[groupName] = !this.showChannels[groupName];
    for (var i in this.authorisedChannels[groupName]){
      this.showChannelEdits[groupName][this.authorisedChannels[groupName][i]] = false;
      this.channelEditArrows[groupName][this.authorisedChannels[groupName][i]] = SIDEARROW;
    }
    if (this.showChannels[groupName]){
      this.channelArrows[groupName] = DOWNARROW;
    } else{
      this.channelArrows[groupName] = SIDEARROW;
    }
  }

  async selectChannel(): Promise<void>{
    //TODO
  }

  async toggleChannelEdit(groupName:string, channelName: string): Promise<void>{
    this.showChannelEdits[groupName][channelName] = !this.showChannelEdits[groupName][channelName];
    if (this.showChannelEdits[groupName][channelName]){
      this.channelEditArrows[groupName][channelName] = DOWNARROW;
    } else{
      this.channelEditArrows[groupName][channelName] = SIDEARROW;
    }
  }

  async deleteChannel(groupName:string, channelName: string): Promise<void>{
    await this.dataService.deleteChannel(groupName, channelName);
    // Refresh the channel list
    this.showChannels[groupName] = false;
    this.toggleChannels(groupName);
  }

  async createChannel(groupName:string): Promise<void>{
    var retVal: any = await this.dataService.createChannel(groupName, this.newChannelNames[groupName])
    // Refresh the channel list
    if (retVal.alreadyExists){
      console.log("Channel Already Exists!")
    } else{
      this.showChannels[groupName] = false;
      this.toggleChannels(groupName);
    }
  }
}
