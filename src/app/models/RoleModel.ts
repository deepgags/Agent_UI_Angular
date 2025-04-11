import { BaseModel } from "./BaseModel";

export class RoleModel {
    RoleId: string;
    RoleName: string;
    IsApproved: boolean;
    IsDefault: boolean;
    
    constructor(roleId: string, roleName: string, isApproved: boolean, isDefault: boolean) {

      this.RoleId = roleId;
      this.RoleName = roleName;
      this.IsApproved = isApproved;
      this.IsDefault = isDefault;
    }

  }