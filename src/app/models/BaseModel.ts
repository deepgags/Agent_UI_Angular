export class BaseModel {
   
Message: string;
Status: boolean;

constructor(message: string, status:boolean) {
    this.Message = message;
    this.Status = status;
}

}