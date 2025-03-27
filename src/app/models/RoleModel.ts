import { BaseModel } from "./BaseModel";

export class RoleModel extends BaseModel {
    RoleId: string;
    RoleName: string;
    IsApproved: boolean;
    IsDefault: boolean;
    
    constructor(message: string, status: boolean, roleId: string, roleName: string, isApproved: boolean, isDefault: boolean) {

      super(message,status);
      
      this.RoleId = roleId;
      this.RoleName = roleName;
      this.IsApproved = isApproved;
      this.IsDefault = isDefault;
    }

  }