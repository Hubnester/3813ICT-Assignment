import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private backendService: BackendService ) { }

  // Get the groups a user is authorised to see
  async getAuthorisedGroups(currentUser: string): Promise<object>{
    return await this.backendService.post("/getAuthorisedGroups", {"user": currentUser});
  }

  // Get the channels in a group a user is authorised to see
  async getAuthorisedGroupChannels(currentUser: string, groupName: string){
    return await this.backendService.post("/getAuthorisedGroupChannels", {"user": currentUser, "groupName": groupName});
  }

  // Get the role of the user
  async getUserRole(currentUser: string){
    return await this.backendService.post("/getUserRole", {"user" : currentUser});
  }

  // Delete the specified channel from the specified group
  async deleteChannel(groupName: string, channelName: string){
    return await this.backendService.post("/deleteChannel", {"groupName": groupName, "channelName": channelName});
  }

  // Create a new channel in the specified group
  async createChannel(groupName: string, channelName: string){
    return await this.backendService.post("/createChannel", {"groupName": groupName, "channelName": channelName});
  }

  // Create a new group
  async createGroup(groupName: string){
    return await this.backendService.post("/createGroup", {"groupName": groupName});
  }

  // Delete the specified group
  async deleteGroup(groupName: string){
    return await this.backendService.post("/deleteGroup", {"groupName": groupName});
  }

  // Get the users
  async getUsers(){
    return await this.backendService.get("/getUsers");
  }

  // Update or create a new user
  async updateUser(userData: any, isNew: boolean = false){
    return await this.backendService.post("/updateUser", {"user": userData, "new": isNew});
  }
}
