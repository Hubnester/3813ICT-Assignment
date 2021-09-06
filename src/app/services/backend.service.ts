import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
}

const BACKEND_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor( private httpClient: HttpClient ) { }

  async get(path: string): Promise<any>{
    var values: any;
    await this.httpClient.get(BACKEND_URL + path)
      .toPromise().then(data => {
        values = data
      })
    return values;
  }

}
