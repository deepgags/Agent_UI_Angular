import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmDialog, ConfirmDialogModule } from "primeng/confirmdialog";
import { Toast } from "primeng/toast";
import { LoadingService } from "./services/loading.service";

@Component({
	selector: "app-root",
	imports: [RouterOutlet, CommonModule, Toast, ConfirmDialogModule, ConfirmDialog],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss",
})
export class AppComponent {
	constructor(public loadingService: LoadingService) {}
}
