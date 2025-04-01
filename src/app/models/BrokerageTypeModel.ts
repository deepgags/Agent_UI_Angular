export class BrokerageTypeModel {
    BrokerageTypeId: string;
    Name: string;
    IsApproved: boolean;
    IsDefault: boolean;
    
    constructor(brokerageTypeId: string, name: string, isApproved: boolean, isDefault: boolean) {

      this.BrokerageTypeId = brokerageTypeId;
      this.Name = name;
      this.IsApproved = isApproved;
      this.IsDefault = isDefault;
    }

  }