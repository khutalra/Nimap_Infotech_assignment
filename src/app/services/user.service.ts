import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
    private baseURL = 'http://localhost:3000/';
    constructor(private http: HttpClient) { }

    saveProfile(val: any) {
        return this.http.patch(this.baseURL + 'profile', val);
    }

    getProfileData() {
        return this.http.get(this.baseURL + 'profile');  
    }
}
