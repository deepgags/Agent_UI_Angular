import { inject, Injectable, resource, signal } from '@angular/core';
import { RoleModel } from '../models/RoleModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private roles: RoleModel[] = [];
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient) {
    this.Apiurl = environment.agentApiUrl + environment.templateUrl;
  }

  async getRoles(name:string): Promise<RoleModel[]> {

    this.http.get<any>(this.Apiurl + '?name=' + name)
        .subscribe(data => 
            {
                data.data.forEach((role: any) => {
                    this.roles.push(new RoleModel(
                            role.roleid,
                            role.name,
                            role.isapproved,
                            role.isdefault))
                });
          });
    
     return this.roles;
  }

}