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
  groupNameAlreadyExists: boolean = false;
  // Variables for handling group edit display
  showGroupEdits: any = {};
  groupEditArrows: any = {};
  // Varianbles for handling channels
  authorisedChannels: any = {};
  showChannels: any = {};
  channelArrows: any = {};
  channelNameAlreadyExists: any = {};
  // Variables for handling channel edit display
  showChannelEdits: any = {};
  channelEditArrows: any = {};
  // Variables for new groups and channels
  newGroupName: string = "";
  newChannelNames: any = {};
  // Variables for handling the user display
  users: any = [];
  showUsers: boolean = false;
  usersArrow: string = SIDEARROW;
  // Variables for handling the user editing display
  showEditUsers: any = {};
  editUserArrows: any = {};
  // Variables for handling create user display
  showCreateUser: boolean = true;
  createUserArrow: string = SIDEARROW;
  // Variables for creating a new user
  newUser: any = {
    "name": "",
    "email": "",
    "role": "none"
  };
  userNameAlreadyExists: boolean = false;
  newRoles: any = {};
  // Variables for displaying the adding and removing of users from a group
  showAddRemoveGroupUsers: any = {};
  addRemoveGroupUserArrows: any = {};
  authorisedGroupUsers: any = {};
  // Varaibles for displaying the adding and removing of group assistants
  showAddRemoveGroupAssis: any = {};
  addRemoveGroupAssisArrows: any = {};
  groupAssis: any = {};
  // Variables for displaying the adding and removing of users from a channel
  showAddRemoveChannelUsers: any = {};
  addRemoveChannelUserArrows: any = {};
  authorisedChannelUsers: any = {};


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
    //this.authorisedGroups = await this.dataService.getAuthorisedGroups(this.currentUser);
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
    // Reset the error message displays
    this.groupNameAlreadyExists = false;
    this.channelNameAlreadyExists = {};
    this.addRemoveGroupUserArrows = {};
    this.authorisedGroupUsers = {};
    this.showAddRemoveGroupUsers = {};
    this.addRemoveGroupUserArrows = {};
    this.groupAssis = {};
    this.showAddRemoveGroupAssis = {};
    this.addRemoveGroupAssisArrows = {};
    this.authorisedChannelUsers = {};
    this.showAddRemoveChannelUsers = {};
    this.addRemoveChannelUserArrows = {};
    for (var i in this.authorisedGroups){
      // Add the group as a key to the authorised channels
      this.authorisedChannels[this.authorisedGroups[i]] = [];
      // Set the current group to not show the channels in the current group
      this.showChannels[this.authorisedGroups[i]] = false;
      this.showChannelEdits[this.authorisedGroups[i]] = {};
      this.showGroupEdits[this.authorisedGroups[i]] = false;
      // Set the current arrow for the channel display buttons to the side arrow
      this.channelArrows[this.authorisedGroups[i]] = SIDEARROW;
      this.channelEditArrows[this.authorisedGroups[i]] = {};
      this.groupEditArrows[this.authorisedGroups[i]] = SIDEARROW;
      // Set the new channel names as empty string
      this.newChannelNames[this.authorisedGroups[i]] = "";
      this.channelNameAlreadyExists[this.authorisedGroups[i]] = false;
      this.addRemoveGroupUserArrows[this.authorisedGroups[i]] = SIDEARROW;
      this.showAddRemoveGroupUsers[this.authorisedGroups[i]] = false;
      this.addRemoveGroupUserArrows[this.authorisedGroups[i]] = SIDEARROW;
      this.showAddRemoveGroupAssis[this.authorisedGroups[i]] = false;
      this.addRemoveGroupAssisArrows[this.authorisedGroups[i]] = SIDEARROW;
      this.showAddRemoveChannelUsers[this.authorisedGroups[i]] = {};
      this.addRemoveChannelUserArrows[this.authorisedGroups[i]] = {};
      this.authorisedChannelUsers[this.authorisedGroups[i]] = {};
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

  async createGroup(): Promise<void>{
    //var retVal: any = await this.dataService.createGroup(this.newGroupName)
    //if (retVal.alreadyExists){
      //this.groupNameAlreadyExists = true;
    //} else{
      // Refresh the group list
    //  this.showGroups = false;
    //  this.toggleGroups();
    //  this.newGroupName = "";
    //}
  }

  async toggleGroupEdit(groupName:string){
    this.showGroupEdits[groupName] = !this.showGroupEdits[groupName];
    // Hide the channel visibility if it's visible
    if (this.showGroupEdits[groupName] && this.showChannels[groupName]){
      this.toggleChannels(groupName);
    }
    if (this.showGroupEdits[groupName]){
      this.groupEditArrows[groupName] = DOWNARROW;
    } else{
      this.groupEditArrows[groupName] = SIDEARROW;
    }
  }

  async deleteGroup(groupName: string){
  //  await this.dataService.deleteGroup(groupName);
  //  // Refresh the group list
  //  this.showGroups = false;
  //  this.toggleGroups();
  }

  // Toggle the visibility of the channels the user has access to
  async toggleChannels(groupName: any): Promise<void>{
    //this.authorisedChannels[groupName] = await this.dataService.getAuthorisedGroupChannels(this.currentUser, groupName);
    this.showChannels[groupName] = !this.showChannels[groupName];
    this.channelNameAlreadyExists[groupName] = false;
    // Hide the edit group visibility if it's visible
    if (this.showChannels[groupName] && this.showGroupEdits[groupName]){
      this.toggleGroupEdit(groupName);
    }
    for (var i in this.authorisedChannels[groupName]){
      this.showChannelEdits[groupName][this.authorisedChannels[groupName][i]] = false;
      this.channelEditArrows[groupName][this.authorisedChannels[groupName][i]] = SIDEARROW;
      this.showAddRemoveChannelUsers[groupName][this.authorisedChannels[groupName][i]] = false;
      this.addRemoveChannelUserArrows[groupName][this.authorisedChannels[groupName][i]] = SIDEARROW;
    }
    if (this.showChannels[groupName]){
      this.channelArrows[groupName] = DOWNARROW;
    } else{
      this.channelArrows[groupName] = SIDEARROW;
    }
  }

  async createChannel(groupName:string): Promise<void>{
    //var retVal: any = await this.dataService.createChannel(groupName, this.newChannelNames[groupName])
    //if (retVal.alreadyExists){
    //  this.channelNameAlreadyExists[groupName] = true;
    //} else{
    //  // Refresh the channel list
    //  this.showChannels[groupName] = false;
    //  this.toggleChannels(groupName);
    //  this.newChannelNames[groupName] = "";
    //}
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
  //  await this.dataService.deleteChannel(groupName, channelName);
  //  // Refresh the channel list
  //  this.showChannels[groupName] = false;
  //  this.toggleChannels(groupName);
  }

  async toggleUsers(): Promise<void>{
    this.users = await this.dataService.getUsers();
    this.showUsers = !this.showUsers;
    this.showEditUsers = {};
    this.editUserArrows = {};
    this.showCreateUser = false;
    this.createUserArrow = SIDEARROW;
    this.newRoles = {};
    for (var i in this.users){
      this.showEditUsers[this.users[i].name] = false;
      this.editUserArrows[this.users[i].name] = SIDEARROW;
      this.newRoles[this.users[i].name] = this.users[i].role;
    }
    if (this.showUsers){
      this.usersArrow = DOWNARROW;
    } else{
      this.usersArrow = SIDEARROW;
    }
  }

  async toggleEditUser(userName: string): Promise<void>{
    this.showEditUsers[userName] = !this.showEditUsers[userName];
    if (this.showEditUsers[userName]){
      this.editUserArrows[userName] = DOWNARROW;
    } else{
      this.editUserArrows[userName] = SIDEARROW;
    }
  }

  async toggleCreateUser(): Promise<void>{
    this.showCreateUser = !this.showCreateUser;
    this.userNameAlreadyExists = false;
    if (this.showCreateUser){
      this.createUserArrow = DOWNARROW;
    } else{
      this.createUserArrow = SIDEARROW;
    }
    this.newUser.name = "";
    this.newUser.email = "";
    this.newUser.role = "none";
  }

  async addUser(): Promise<void>{
    var retVal: any = await this.dataService.updateUser(this.newUser, true);
    if (retVal.alreadyExists){
      this.userNameAlreadyExists = true;
    } else{
      this.showUsers = false;
      // Refresh the user list
      await this.toggleUsers();
      this.toggleCreateUser();
    }
  }

  async updateUser(user: any): Promise<void>{
    user.role = this.newRoles[user.name];
    await this.dataService.updateUser(user);
  }

  async deleteUser(userName: string): Promise<void>{
    await this.dataService.deleteUser(userName);
    // Refresh the user list
    this.showUsers = false;
    this.toggleUsers();
  }

  async toggleAddRemoveGroupUsers(groupName: string){
    //this.showAddRemoveGroupUsers[groupName] = !this.showAddRemoveGroupUsers[groupName];
    //var users: any = await this.dataService.getUsers();
    //var authorisedUsers: any = await this.dataService.getAuthorisedGroupUsers(groupName);
    //this.authorisedGroupUsers[groupName] = [];
    //for (var i in users){
    //  if (authorisedUsers[users[i].name]){
    //    this.authorisedGroupUsers[groupName][i] = {"name" : users[i].name, "authorised": true};
    //  } else{
    //    this.authorisedGroupUsers[groupName][i] = {"name" : users[i].name, "authorised": false};
    //  }
    //}
    //if (this.showAddRemoveGroupUsers[groupName]){
    //  this.addRemoveGroupUserArrows[groupName] = DOWNARROW;
    //} else{
    //  this.addRemoveGroupUserArrows[groupName] = SIDEARROW;
    //}
  }

  async addRemoveGroupUser(groupName:string, userName:string, remove: boolean){
    //await this.dataService.addRemoveGroupUser(groupName, userName, remove);
    // Refresh the add/remove group user list
    //this.showAddRemoveGroupUsers[groupName] = false;
    //this.toggleAddRemoveGroupUsers(groupName);
  }

  async toggleAddRemoveGroupAssis(groupName: string){
    //this.showAddRemoveGroupAssis[groupName] = !this.showAddRemoveGroupAssis[groupName];
    //var users: any = await this.dataService.getUsers();
    //var groupAssis: any = await this.dataService.getGroupAssis(groupName);
    //this.groupAssis[groupName] = [];
    //for (var i in users){
    //  if (groupAssis[users[i].name]){
    //    this.groupAssis[groupName][i] = {"name" : users[i].name, "assis": true};
    //  } else{
    //    this.groupAssis[groupName][i] = {"name" : users[i].name, "assis": false};
    //  }
    //}
    //if (this.showAddRemoveGroupAssis[groupName]){
    //  this.addRemoveGroupAssisArrows[groupName] = DOWNARROW;
    //} else{
    //  this.addRemoveGroupAssisArrows[groupName] = SIDEARROW;
    //}
  }

  async addRemoveGroupAssis(groupName:string, userName:string, remove: boolean){
    //await this.dataService.addRemoveGroupAssis(groupName, userName, remove);
    // Refresh the add/remove group user list
    //this.showAddRemoveGroupAssis[groupName] = false;
    //this.toggleAddRemoveGroupAssis(groupName);
  }

  async toggleAddRemoveChannelUsers(groupName: string, channelName: string){
    //this.showAddRemoveChannelUsers[groupName][channelName] = !this.showAddRemoveChannelUsers[groupName][channelName];
    //var users: any = await this.dataService.getGroupUsers(groupName);
    //var authorisedUsers: any = await this.dataService.getAuthorisedChannelUsers(groupName, channelName);
    //this.authorisedChannelUsers[groupName][channelName] = [];
    //for (var i in users){
    //  if (authorisedUsers[users[i].name]){
    //    this.authorisedChannelUsers[groupName][channelName][i] = {"name" : users[i].name, "authorised": true};
    //  } else{
    //    this.authorisedChannelUsers[groupName][channelName][i] = {"name" : users[i].name, "authorised": false};
    //  }
    //}
    //if (this.showAddRemoveChannelUsers[groupName][channelName]){
    //  this.addRemoveChannelUserArrows[groupName][channelName] = DOWNARROW;
    //} else{
    //  this.addRemoveChannelUserArrows[groupName][channelName] = SIDEARROW;
    //}
  }

  async addRemoveChannelUser(groupName:string, channelName: string, userName:string, remove: boolean){
    //await this.dataService.addRemoveChannelUser(groupName, channelName, userName, remove);
    // Refresh the add/remove group user list
    //this.showAddRemoveChannelUsers[groupName][channelName] = false;
    //this.toggleAddRemoveChannelUsers(groupName, channelName);
  }
}
