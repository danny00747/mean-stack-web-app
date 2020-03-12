import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;


  constructor(private _http: HttpClient) {
  }

  registerUser(user) {
    return this._http.post('/server/api/signup', user, {headers});
  }

  loginUser(user) {
    return this._http.post('/server/api/login', user, {headers});
  }

  getProfile() {
    this.getToken();
    //console.log(this.authToken);
    //console.log(JSON.parse(this.user).userId);
    if (this.authToken) {
      const httpAuthHeaders = new HttpHeaders()
        .set('Authorization', this.authToken);
      return this._http.get(`/server/api/user/profile/${JSON.parse(this.user).userId}`,
        {headers: httpAuthHeaders});
    }
  }

  storeUserData(data : any) {
    localStorage.setItem("id_token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    this.authToken = data.token;
    this.user = data.user;
  }

  getToken() {
    this.authToken = localStorage.getItem("id_token");
    this.user = localStorage.getItem("user");
  }


  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    //localStorage.clear();
  }

  loggedIn() {
    return !!this.authToken;
  }

}

