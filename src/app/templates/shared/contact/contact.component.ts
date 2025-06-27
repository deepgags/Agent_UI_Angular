import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SiteConfig } from "../../../models/SiteConfig";
import { PhoneSearch } from "../../../pipes/phoneSearch";
import { UpperCase } from "../../../pipes/upper";
import { SiteConfigService } from "../../../services/site-config.service";
import { SearchComponent } from "../search/search.component";

@Component({
	selector: "app-contact",
	imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, RouterModule],
	templateUrl: "./contact.component.html",
	styleUrl: "./contact.component.scss",
})
export class ContactComponent {
	userForm!: FormGroup;
	siteConfig: SiteConfig | undefined;
	siteConfigSubscription: any;

	contactText =
		"Your way to better real estate software starts here. For 35 years, we’ve proudly delivered the gold standard in real estate software to businesses of all shapes, sizes, and structures, and we’d be honored to partner with your organization today.";

	constructor(private fb: FormBuilder, private siteConfigService: SiteConfigService) {}

	ngOnInit(): void {
		this.userForm = this.fb.group({
			firstName: new FormControl("", Validators.required),
			phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^(([0-9]{3}) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$")]),
			emailAddress: new FormControl("", [Validators.required, Validators.email]),
			comment: new FormControl("", Validators.required),
		});

		this.siteConfigSubscription = this.siteConfigService.currentConfig$.subscribe((config) => {
			if (config) {
				this.siteConfig = config;
			}
		});
	}
}
