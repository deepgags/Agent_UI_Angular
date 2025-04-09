export class InterestedUserModel {
    propertyId: string = "";
    mlsId: string = "";
    firstName: string = "";
    lastName: string = "";
    emailAddress: string = "";
    phoneNumber: string = "";
    cellNumber: string = "";
    address: string = "";
    comment: string = "";
    latitude: number = 0;
    longitude: number = 0;
    
    constructor(propertyId: string = "", mlsId: string = "", firstname: string = "",lastname: string = "",
       emailAddress: string = "", phoneNumber: string = "", cellNumber: string = "",
        address:string ="", comment:string = "") {

      this.propertyId = propertyId;
      this.mlsId = mlsId;
      this.firstName = firstname;
      this.lastName = lastname;
      this.emailAddress = emailAddress;
      this.phoneNumber = phoneNumber;
      this.cellNumber = cellNumber;
      this.address = address;
    }
  }