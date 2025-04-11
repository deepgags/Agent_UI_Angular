import { BrokerageTypeModel } from "./BrokerageTypeModel";
import { RoleModel } from "./RoleModel";

export class CustomerModel {
    customerId: string = "";
    brokerageTypeId: string = "";
    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    businessName: string = "";
    phoneNumber: string = "";
    cellNumber: string = "";
    address: string = "";
    password: string = "";
    confirmPassword: string = "";
    roleId: string = "";
    siteUrl: string = "";
    logoImage: string = "";
    logoImagePath: string = "";
    profileImage: string = "";
    profileImagePath: string = "";
    templateId: string = "";
    isApproved: boolean = false;
    brokerage: BrokerageTypeModel | undefined ;
    role: RoleModel | undefined ;
    
    constructor(customerId: string = "", firstname: string = "",
        lastname: string = "", emailAddress: string = "", businessName: string = "", phoneNumber: string = "",
        isApproved: boolean = false, roleId: string = "", templateId: string = "", brokerageTypeId: string = ""
        , siteUrl: string="" ) {

      this.customerId = customerId;
      this.firstName = firstname;
      this.lastName = lastname;
      this.emailAddress = emailAddress;
      this.businessName = businessName;
      this.phoneNumber = phoneNumber;
      this.isApproved = isApproved;
      this.roleId =  roleId;
      this.templateId = templateId;
      this.brokerageTypeId = brokerageTypeId;
      this.siteUrl = siteUrl;
    }

    getFullName(): string {
        return `${this.firstName} (${this.lastName})`;
    }
  }