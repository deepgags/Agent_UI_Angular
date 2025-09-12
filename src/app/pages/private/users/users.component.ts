import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { PaginatorModule } from "primeng/paginator";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { SimpleTableComponent } from "../../../components/simple-table/simple-table.component";
import { FieldsType } from "../../../enums/fields-type.enum";
import { NotificationService } from "../../../services/notification.service";
import { Users, UsersService } from "../../../services/users.service";

@Component({
	selector: "app-users",
	standalone: true,
	imports: [CommonModule, TableModule, ButtonModule, PaginatorModule, ProgressSpinnerModule, SimpleTableComponent],
	templateUrl: "./users.component.html",
	styleUrls: ["./users.component.scss"],
	providers: [ConfirmationService],
})
export class UsersComponent implements OnInit {
	users: Users[] = [];

	columns = [
		{
			field: "name",
			header: "Name",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "email",
			header: "Email",
			disableSort: false,
			fieldType: FieldsType.Text,
		},
		{
			field: "phone",
			header: "Phone",
			disableSort: false,
			fieldType: FieldsType.Telephone,
		},
		{
			field: "createdAt",
			header: "Joined",
			disableSort: true,
			fieldType: FieldsType.Date,
		},
		{
			field: "action",
			header: "Action",
			disableSort: true,
			fieldType: FieldsType.Action,
		},
	];

	pagedLeads: Users[] = [];
	rows: number = 5;
	first: number = 0;
	loading: boolean = false;
	error: string | null = null;

	private notificationService = inject(NotificationService);
	private usersService = inject(UsersService);
	private confirmationService = inject(ConfirmationService);
	constructor() {}

	ngOnInit() {
		this.getUsers();
	}

	getUsers() {
		this.loading = true;
		this.error = null;
		this.usersService.getUsers().subscribe({
			next: (res: any) => {
				this.users = res.data;
				this.loading = false;
			},
			error: (error) => {
				this.error = "Failed to load users";
				this.loading = false;
				console.error("Error loading users:", error);
			},
		});
	}

	deleteUser = (user: any, index: number) => {
		this.confirmationService.confirm({
			header: "Delete User",
			message: "Do you want to delete this user?",
			icon: "bi bi-trash3",
			rejectLabel: "Cancel",
			rejectButtonProps: {
				label: "Cancel",
				severity: "secondary",
				outlined: true,
			},
			acceptButtonProps: {
				label: "Delete",
				severity: "danger",
			},

			accept: () => {
				this._confirmDeleteUser(user, index);
			},
			reject: () => {},
		});
	};

	private _confirmDeleteUser = (user: any, index: number) => {
		this.loading = true;
		this.usersService.deleteUser(user.id).subscribe({
			next: () => {
				this.users.splice(index, 1);
				this.loading = false;
				this.notificationService.showError("User deleted.");
			},
			error: (error) => {
				this.loading = false;
				console.error("Error deleting user:", error);
				this.notificationService.showError("Unable to delete user.");
			},
		});
	};
}
