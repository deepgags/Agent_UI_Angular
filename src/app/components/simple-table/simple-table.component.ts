import { CommonModule } from "@angular/common";
import { Component, Input, Output, ViewChild } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { Table, TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { FieldsType } from "../../enums/fields-type.enum";
import { CamelCaseToCapitalize } from "../../pipes/camelCaseToCapitalize";
import { PhoneNumberFormatPipe } from "../../pipes/phone-format";

@Component({
	selector: "app-simple-table",
	templateUrl: "./simple-table.component.html",
	styleUrls: ["./simple-table.component.scss"],
	standalone: true,
	imports: [CommonModule, TableModule, TooltipModule, ButtonModule, PhoneNumberFormatPipe, CamelCaseToCapitalize],
})
export class SimpleTableComponent {
	selected: any = [];
	@ViewChild("table") table: any;
	@Input("columns") columns: any;
	@Input("data") data: any;
	@Input("paginator") paginator: boolean = true;
	@Input("rows") rows: number = 25;
	@Input("isMultiple") isMultiple: boolean = false;
	@Input("showFilter") showFilter: boolean = false;

	@Input("showActions") showActions: boolean = false;

	@Input("showEditAction") showEditAction: boolean = false;
	@Input("onEdit") onEdit: Function = () => {};

	@Input("showDeleteAction") showDeleteAction: boolean = false;
	@Input("onDelete") onDelete: Function = () => {};

	@Input("showExtraAction") showExtraAction: boolean = false;
	@Input("extraActionToolTip") extraActionToolTip: string = "";
	@Input("extraActionIcon") extraActionIcon: string = "";
	@Input("onExtraAction") onExtraAction: Function = () => {};

	@Input("showFirstAction") showFirstAction: boolean = false;
	@Input("firstActionToolTip") firstActionToolTip: string = "";
	@Input("firstActionIcon") firstActionIcon: string = "";
	@Input("onFirstActionClick") onFirstActionClick: Function = () => {};

	@Input("showSecondAction") showSecondAction: boolean = false;
	@Input("secondActionToolTip") secondActionToolTip: string = "";
	@Input("secondActionIcon") secondActionIcon: string = "";
	@Input("onSecondActionClick") onSecondActionClick: Function = () => {};
	@Input("exportFileName") exportFileName: string = "download";

	@Input("highlightRow") highlightRow: boolean = false;
	@Input("highlightCheckValue") highlightCheckValue: any = "";
	@Input("highlightCheckKey") highlightCheckKey: string = "";
	@Input("highlightActiveClass") highlightActiveClass: string = "";

	@Input("disableEditAction") disableEditAction: boolean = false;
	@Input("disableDeleteAction") disableDeleteAction: boolean = false;
	// @Input('disableExtraAction') disableExtraAction: boolean = false;

	@Output("selectedData") selectedData: any;

	constructor() {}

	private phonePipe = new PhoneNumberFormatPipe();
	private capitalizePipe = new CamelCaseToCapitalize();

	get fieldTypes() {
		return FieldsType;
	}

	formatContactField(rowData: any, field: string, col: any): string {
		const value = rowData[field];
		if (value === undefined || value === null || value === "") {
			return "-";
		}
		if (col.phoneFields?.includes(field)) {
			return this.phonePipe.transform(value);
		}
		if (col.capitalizeFields?.includes(field)) {
			return this.capitalizePipe.transform(value) ?? value;
		}
		return value;
	}

	exportCSV(table: Table) {
		const columns = JSON.parse(JSON.stringify(this.columns));
		for (const i in columns) {
			if (
				columns[i].fieldType == FieldsType.LinkButton ||
				columns[i].fieldType == FieldsType.Image ||
				columns[i].fieldType == FieldsType.Action
			) {
				columns.splice(i, 1);
			}
		}
		this.table.columns = columns;
		this.table.exportCSV();
		this.table.columns = this.columns;
	}
}
