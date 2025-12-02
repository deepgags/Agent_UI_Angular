import { Routes } from "@angular/router";
import { ThankyouComponent } from "./components/thankyou/thankyou.component";
import { authGuard } from "./guards/auth.guard";
import { brokerGuard } from "./guards/broker.guard";
import { ChangePasswordComponent } from "./pages/private/change-password/change-password.component";
import { AdminComponent } from "./pages/private/dashboard/dashboard.component";
import { LeadsComponent } from "./pages/private/leads/leads.component";
import { ManagerComponent } from "./pages/private/manager/manager.component";
import { MenuManagerComponent } from "./pages/private/menu-manager/menu-manager.component";
import { PageManagerComponent } from "./pages/private/page-manager/page-manager.component";
import { PaymentComponent } from "./pages/private/payment/payment.component";
import { PrivateComponent } from "./pages/private/private.component";
import { SettingsComponent } from "./pages/private/settings/settings.component";
import { TeamComponent } from "./pages/private/team/team.component";
import { TemplateComponent } from "./pages/private/template/template.component";
import { TestimonialComponent } from "./pages/private/testimonial/testimonial.component";
import { UsersComponent } from "./pages/private/users/users.component";
import { DreamComponent } from "./pages/public/dream-home/dream-home.component";
import { ForgotComponent } from "./pages/public/forgot/forgot.component";
import { HomeDetailComponent } from "./pages/public/home-detail/home-detail.component";
import { HomeReviewComponent } from "./pages/public/home-review/home-review.component";
import { WorthComponent } from "./pages/public/home-worth/home-worth.component";
import { LoginComponent } from "./pages/public/login/login.component";
import { NeighborDetailComponent } from "./pages/public/neighbor-detail/neighbor-detail.component";
import { NotFoundComponent } from "./pages/public/not-found/not-found.component";
import { RegisterComponent } from "./pages/public/register/register.component";
import { TeamDetailComponent } from "./pages/public/team-details/team-details.component";
import { TeamListComponent } from "./pages/public/team-list/team-list.component";
import { TemplatesComponent } from "./pages/public/templates/templates.component";
import { UserLoginComponent } from "./pages/public/user-login/user-login.component";
import { UserSignupComponent } from "./pages/public/user-signup/user-signup.component";
import { VerifyEmailComponent } from "./pages/public/verify-email/verify-email.component";

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
	{ path: "team/:memberId", component: TeamDetailComponent },
	{ path: "team", component: TeamListComponent },
	{ path: "home-worth", component: WorthComponent },
	{ path: "dream-home", component: DreamComponent },
	{ path: "home-detail", component: HomeDetailComponent },
	{ path: "neighbor-detail", component: NeighborDetailComponent },
	{ path: "home-review", component: HomeReviewComponent },
	{
		path: "",
		component: PrivateComponent,
		children: [
			{ path: "dashboard", component: AdminComponent },
			{ path: "leads", component: LeadsComponent },
			{ path: "testimonial", component: TestimonialComponent },
			{ path: "settings", component: SettingsComponent },
			{ path: "old-manager", component: ManagerComponent },
			{ path: "page-manager", component: PageManagerComponent },
			{ path: "menu-manager", component: MenuManagerComponent },
			{ path: "change-password", component: ChangePasswordComponent },
			{ path: "template", component: TemplateComponent },
			{ path: "payment", component: PaymentComponent },
			{ path: "users", component: UsersComponent },
			{ path: "team", component: TeamComponent, canActivate: [brokerGuard] },
		],
		canActivate: [authGuard],
	},
	{ path: "**", component: NotFoundComponent },
];
