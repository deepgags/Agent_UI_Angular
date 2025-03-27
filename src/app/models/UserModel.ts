export class UserModel {
    CustomerId: string = "";
    BusinessName: string = "";
    FirstName: string = "";
    LastName: string = "";
    EmailAddress: string = "";
    Address: string = "";
    PhoneNumber: string = "";
    TemplateId: string = "";
    RoleId: string = "";
    RoleName: string = "";
    SiteUrl: string = "";
    LogoImage: string = "";
    LogoImagePath: string = "";
    ProfileImage: string = "";
    ProfileImagePath: string = "";
    get IsLogged(): boolean { 
        return this.CustomerId != "" ;
    }
}