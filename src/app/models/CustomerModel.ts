import { BrokerageTypeModel } from "./BrokerageTypeModel";


export interface CustomerModel {
	_id?: string;
	brokerageTypeId: string;
	firstName: string;
	lastName: string;
	emailAddress: string;
	businessName: string;
	phoneNumber: string;
	cellNumber: string;
	address: string;
	password: string;
	confirmPassword: string;
	role?: string;
	siteUrl?: string;
	logoImage?: string;
	profileImage: string;
	brokerage?: BrokerageTypeModel | undefined;
}