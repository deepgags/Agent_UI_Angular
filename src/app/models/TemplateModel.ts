import { BaseModel } from "./BaseModel";

export class TemplateModel extends BaseModel {
    TemplateId: string;
    TemplateName: string;
    Description: string;
    Data: string;
    Images: string[];
    IsApproved: boolean;
    IsDefault: boolean;
    
    constructor(message: string, status: boolean, templateId: string, templateName: string, description: string,
        data: string, images: string[], isApproved: boolean, isDefault: boolean) {

      super(message,status);
      
      this.TemplateId = templateId;
      this.TemplateName = templateName;
      this.Description = description;
      this.Data = data;
      this.Images = images;
      this.IsApproved = isApproved;
      this.IsDefault = isDefault;
    }

  }