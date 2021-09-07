import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private backendService: BackendService ) { }

  // Get the groups a user is authorised to see
  async getAuthorisedGroups(currentUser: string): Promise<object>{
    return await this.backendService.post("/getAuthorisedGroups", {"user" : currentUser});
  }

  async getAuthorisedGroupChannels(currentUser: string, groupName: string){
    return await this.backendService.post("/getAuthorisedGroupChannels", {"user" : currentUser, "groupName": groupName});
  }
}
