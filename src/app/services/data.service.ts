import { Injectable } from '@angular/core';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private backendService: BackendService ) { }

  // Read the data from the file
  async getData(): Promise<object>{
    var data: object = await this.backendService.get("/getData");
    console.log(data);
    return data;
  }
}
