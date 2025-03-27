import { BaseModel } from "./BaseModel";

export class CustomerModel extends BaseModel {
    CustomerId: string = "";
    FirstName: string = "";
    LastName: string = "";
    EmailAddress: string = "";
    BusinessName: string = "";
    PhoneNumber: string = "";
    Address: string = "";
    Password: string = "";
    ConfirmPassword: string = "";
    RoleId: string = "";
    SiteUrl: string = "";
    LogoImage: string = "";
    LogoImagePath: string = "";
    ProfileImage: string = "";
    ProfileImagePath: string = "";
    TemplateId: string;
    IsApproved: boolean = false;
    
    constructor(message: string = "", status: boolean = false, customerId: string = "", firstname: string = "",
        lastname: string = "", emailAddress: string = "", businessName: string = "", phoneNumber: string = "",
        isApproved: boolean = false, roleId: string = "", templateId: string = "") {

      super(message,status);
      
      this.CustomerId = customerId;
      this.FirstName = firstname;
      this.LastName = lastname;
      this.EmailAddress = emailAddress;
      this.BusinessName = businessName;
      this.PhoneNumber = phoneNumber;
      this.IsApproved = isApproved;
      this.RoleId =  roleId;
      this.TemplateId = templateId;
    }

    getFullName(): string {
        return `${this.FirstName} (${this.LastName})`;
    }
  }