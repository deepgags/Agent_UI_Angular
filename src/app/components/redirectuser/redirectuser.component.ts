import { CommonModule, DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { CustomerModel } from "../../models/CustomerModel";
import { CustomerService } from "../../services/customer.service";
import { NotificationService } from "../../services/notification.service";
import { StorageService } from "../../services/storage.service";

@Component({
	selector: "app-redirectuser",
	imports: [CommonModule],
	templateUrl: "./redirectuser.component.html",
	styleUrl: "./redirectuser.component.scss",
})
export class RedirectUserComponent implements OnInit {
	customerModel!: CustomerModel;
	private style: HTMLLinkElement | null = null;
	private cssFile: string = "";

	constructor(
		private customerService: CustomerService,
		private titleService: Title,
		private storageService: StorageService,
		@Inject(DOCUMENT) private document: Document,
		private renderer2: Renderer2,
		@Inject(PLATFORM_ID) private platformId: Object,
		private router: Router
	) {
		this.titleService.setTitle("Redirecting...");
	}

	ngOnInit() {
		// const savedUserInfo = this.storageService.getLoggedUserFromUserInfo();
		// if (savedUserInfo.customerId == "") {
		// 	const isBrowser = isPlatformBrowser(this.platformId);
		// 	if (isBrowser) {
		// 		const currentUrl = window.location.host;
		// 		this.customerService.customerExistWithSiteUrl(currentUrl)
		// 			.subscribe({
		// 				next: (response) => {
		// 					if (response && response.customerId != "") {
		// 						this.storageService.saveUserInfo(JSON.stringify(response));
		// 					}
		// 					//this.loadTemplateStyles();
		// 					this.redirectUser(response);
		// 				},
		// 				error: () => {
		// 					this.router.navigateByUrl("/register");
		// 				},
		// 				complete: () => {
		// 				}
		// 			})
		// 	}
		// 	return;
		// }
		// else {
		// 	//this.loadTemplateStyles();
		// 	this.redirectUser(savedUserInfo);
		// }
	}
	loadTemplateStyles() {
		// const userInfo = this.storageService.getLoggedUserFromUserInfo();
		// switch (userInfo.templateId) {
		// 	case '0b69c6031f111d63bc2c975dd2837e38':
		// 		// this.cssFile = `GreenTemplate.css`;
		// 		break;
		// 	case '0b69c6031f111d63bc2c975dd2837e39':
		// 		//this.cssFile = `BlueTemplate.css`;
		// 		break;
		// }
		//this.style = this.renderer2.createElement('link') as HTMLLinkElement;
		// Set type of the link item and path to the css file
		// this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
		// this.renderer2.setProperty(this.style, 'href', this.cssFile);
		// this.renderer2.setProperty(this.style, 'id', "themeCSS");
		// Add the style to the head section
		//this.renderer2.appendChild(this.document.head, this.style);
	}

	redirectUser(userInfo: CustomerModel) {
		// userInfo = this.storageService.getLoggedUserFromUserInfo();
		if (userInfo._id != "") {
			// switch (userInfo.templateId) {
			// 	case "0b69c6031f111d63bc2c975dd2837e38":
			// 		this.router.navigateByUrl("/t1");
			// 		break;
			// 	case "0b69c6031f111d63bc2c975dd2837e39":
			// 		this.router.navigateByUrl("/t2");
			// 		break;
			// 	case "0b69c6031f111d63bc2c975dd2837e40":
			// 		this.router.navigateByUrl("/t3");
			// 		break;
			// 	case "0b69c6031f111d63bc2c975dd2837e41":
			// 		this.router.navigateByUrl("/t4");
			// 		break;
			// 	default:
			// 		this.router.navigateByUrl("/t1");
			// }
		} else {
			this.router.navigateByUrl("/");
		}
	}
}
