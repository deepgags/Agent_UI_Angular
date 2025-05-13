export class TemplateModel {
	_id: string = "";
	name: string = "";
	templateKey: string = "";
	description: string = "";
	data: string = "";
	images: string[] | any = [];
	isApproved: boolean = false;
	isDefault: boolean = false;
	isSelected: boolean = false;
}