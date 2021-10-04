import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private backendService: BackendService ) { }

  // Check if the user meets the supplied minimum authorisation
  async checkUserAuthorised(minRole: string, group: string | null = null){
    return await this.backendService.post("/checkUserAuthorised", {"minRole": minRole, "groupName": group, "user": localStorage.getItem("currentUser")})
  }

  // Get the channels in the groups the user is authorised to see
  async getAuthorisedChannels(): Promise<object>{
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

  // Get the authorised users for a group in object format
  async getAuthorisedGroupUsers(groupName: string){
    return await this.backendService.post("/getAuthorisedGroupUsers", {"group": groupName});
  }

  // Add or remove a user from a group
  async addRemoveGroupUser(groupName: string, userName: string, remove: boolean){
    return await this.backendService.post("/addRemoveGroupUser", {"group": groupName, "user": userName, "remove": remove});
  }

  // Get the group assistants for a group in object format
  async getGroupAssis(groupName: string){
    return await this.backendService.post("/getGroupAssis", {"group": groupName});
  }

  // Add or remove a user as a group assistant
  async addRemoveGroupAssis(groupName: string, userName: string, remove: boolean){
    return await this.backendService.post("/addRemoveGroupAssis", {"group": groupName, "user": userName, "remove": remove});
  }

  // Get the members for a group
  async getGroupUsers(groupName: string){
    return await this.backendService.post("/getGroupUsers", {"group": groupName});
  }

  // Get the authorised users for a channel in object format
  async getAuthorisedChannelUsers(groupName: string, channelName: string){
    return await this.backendService.post("/getAuthorisedChannelUsers", {"group": groupName, "channel" : channelName});
  }

  // Add or remove a user from a channel
  async addRemoveChannelUser(groupName: string, channelName: string, userName: string, remove: boolean){
    return await this.backendService.post("/addRemoveChannelUser", {"group": groupName, "channel": channelName, "user": userName, "remove": remove});
  }
}
