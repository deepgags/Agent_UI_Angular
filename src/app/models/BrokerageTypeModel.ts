export class BrokerageTypeModel {
    BrokerageTypeId: string;
    Name: string;
    LogoPath: string;
    IsApproved: boolean;
    IsDefault: boolean;
    
    constructor(brokerageTypeId: string, name: string, logopath: string, isApproved: boolean, isDefault: boolean) {

      this.BrokerageTypeId = brokerageTypeId;
      this.Name = name;
      this.LogoPath = logopath;
      this.IsApproved = isApproved;
      this.IsDefault = isDefault;
    }

    isSVGLogo(): boolean {
      return typeof this.LogoPath === 'string' && this.LogoPath.endsWith('.svg');
    }

  }