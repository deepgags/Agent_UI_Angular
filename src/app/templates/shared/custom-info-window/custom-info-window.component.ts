import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";

@Component({
	selector: "app-custom-info-window",
	templateUrl: "./custom-info-window.component.html",
	styleUrls: ["./custom-info-window.component.scss"],
	standalone: true,
	imports: [CommonModule],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInfoWindowComponent {
	@Input() infoContent!: {
		property: any;
		html: string;
	};
	@Output() closeInfoWindow = new EventEmitter<void>();

	close() {
		this.closeInfoWindow.emit();
	}
}
