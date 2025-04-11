export class BrokerageTypeModel {
  BrokerageTypeId: string;
  Name: string;
  AlternateName: string;
  LogoPath: string;
  IsApproved: boolean;
  IsDefault: boolean;
  
  constructor(brokerageTypeId: string, name: string, alternateName: string, logopath: string, isApproved: boolean, isDefault: boolean) {

    this.BrokerageTypeId = brokerageTypeId;
    this.Name = name;
    this.AlternateName = alternateName;
    this.LogoPath = logopath;
    this.IsApproved = isApproved;
    this.IsDefault = isDefault;
  }

  isSVGLogo(): boolean {
    return typeof this.LogoPath === 'string' && this.LogoPath.endsWith('.svg');
  }

}