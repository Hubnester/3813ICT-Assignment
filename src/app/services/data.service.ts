import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private backendService: BackendService ) { }

  // Attmept to log in the suer
  async login(loginDetails: object){
    return await this.backendService.post("/login", loginDetails)
  }

  // Check if the user meets the supplied minimum authorisation
  async checkUserAuthorised(minRole: string, group: string | null = null, user: string | null = localStorage.getItem("currentUser")){
    return await this.backendService.post("/checkUserAuthorised", {"minRole": minRole, "groupName": group, "user": user})
  }

  // Get the channels in the groups the user is authorised to see
  async getAuthorisedGroupChannels(){
    return await this.backendService.post("/getAuthorisedChannels", {"user": localStorage.getItem("currentUser")});
  }

  // Delete the specified channel or group
  async deleteGroupChannel(group: string, channel: string | null = null){
    return await this.backendService.post("/deleteGroupChannel", {"groupName": group, "channelName": channel, "user": localStorage.getItem("currentUser")});
  }

  // Create a new channel or group
  async createGroupChannel(group: string, channel: string | null){
    return await this.backendService.post("/createGroupChannel", {"groupName": group, "channelName": channel, "user": localStorage.getItem("currentUser")});
  }

  // Get a list of users that says wether they are authorised to access the group and its channels
  async getAuthorisedGroupChannelUsers(group: string){
    return await this.backendService.post("/getAuthorisedGroupChannelUsers", {"groupName": group, "user": localStorage.getItem("currentUser")});
  }

  // Add or remove a user from a group or channel
  async addRemoveGroupChannelUser(userName: string, remove: boolean, group: string, channel: string | null = null){
    return await this.backendService.post("/addRemoveGroupChannelUser", {"groupName": group, "channelName": channel, "userName": userName, "remove": remove, "user": localStorage.getItem("currentUser")});
  }

  // FUNCTIONS NOT YET EDITED

  // Get the role of the user
  async getUserRole(currentUser: string){
    return await this.backendService.post("/getUserRole", {"user" : currentUser});
  }

  // Get the users
  async getUsers(){
    return await this.backendService.get("/getUsers");
  }

  // Update or create a new user
  async updateUser(userData: any, isNew: boolean = false){
    return await this.backendService.post("/updateUser", {"user": userData, "new": isNew});
  }

  // Update or create a new user
  async deleteUser(userName: string){
    return await this.backendService.post("/deleteUser", {"user": userName});
  }

  // Add or remove a user as a group assistant
  async addRemoveGroupAssis(groupName: string, userName: string, remove: boolean){
    return await this.backendService.post("/addRemoveGroupAssis", {"group": groupName, "user": userName, "remove": remove});
  }
}
