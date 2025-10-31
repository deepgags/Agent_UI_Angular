import { Routes } from "@angular/router";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { authGuard } from "./guards/auth.guard";
import { ChangePasswordComponent } from "./pages/private/change-password/change-password.component";
import { AdminComponent } from "./pages/private/dashboard/dashboard.component";
import { LeadsComponent } from "./pages/private/leads/leads.component";
import { ManagerComponent } from "./pages/private/manager/manager.component";
import { PaymentComponent } from "./pages/private/payment/payment.component";
import { PrivateComponent } from "./pages/private/private.component";
import { SettingsComponent } from "./pages/private/settings/settings.component";
import { TemplateComponent } from "./pages/private/template/template.component";
import { TestimonialComponent } from "./pages/private/testimonial/testimonial.component";
import { UsersComponent } from "./pages/private/users/users.component";
import { ForgotComponent } from "./pages/public/forgot/forgot.component";
import { LoginComponent } from "./pages/public/login/login.component";
import { NotFoundComponent } from "./pages/public/not-found/not-found.component";
import { RegisterComponent } from "./pages/public/register/register.component";
import { TemplatesComponent } from "./pages/public/templates/templates.component";
import { UserLoginComponent } from "./pages/public/user-login/user-login.component";
import { UserSignupComponent } from "./pages/public/user-signup/user-signup.component";
import { VerifyEmailComponent } from "./pages/public/verify-email/verify-email.component";
import { AgentComponent } from "./pages/public/agent-details/agent-details.component";
import { WorthComponent } from "./pages/public/home-worth/home-worth.component";
import { DreamComponent } from "./pages/public/dream-home/dream-home.component";
import { DreamHomeComponent } from "./pages/public/home-detail/home-detail.component";
import { NeighboursComponent } from "./pages/public/neighbours-detail/neighbours-detail.component";
import { HomeReviewComponent } from "./pages/public/home-review/home-review.component";

export const routes: Routes = [
	// { path: "", redirectTo: '/loading', pathMatch: "full" },
	// { path: "loading", component: RedirectUserComponent },
	{ path: "register", component: RegisterComponent },
	{ path: "login", component: LoginComponent },
	{ path: "forgot-password", component: ForgotComponent },
	{ path: "templates", component: TemplatesComponent },
	{ path: "verify", component: VerifyEmailComponent },
	{ path: "thanks", component: ThankyouComponent },
	{ path: "user-login", component: UserLoginComponent },
	{ path: "user-signup", component: UserSignupComponent },
	{ path: "agent-details", component: AgentComponent },
	{ path: "home-worth", component: WorthComponent },
	{ path: "dream-home", component: DreamComponent },
	{ path: "home-detail", component: DreamHomeComponent},
	{ path: "neighbours-detail", component: NeighboursComponent},
	{ path: "home-review", component: HomeReviewComponent},
	{
		path: "",
		component: PrivateComponent,
		children: [
			{ path: "dashboard", component: AdminComponent },
			{ path: "leads", component: LeadsComponent },
			{ path: "testimonial", component: TestimonialComponent },
			{ path: "settings", component: SettingsComponent },
			{ path: "page-manager", component: ManagerComponent },
			{ path: "change-password", component: ChangePasswordComponent },
			{ path: "template", component: TemplateComponent },
			{ path: "payment", component: PaymentComponent },
			{ path: "users", component: UsersComponent },
		],
		canActivate: [authGuard],
	},
	{ path: "**", component: NotFoundComponent },
];
