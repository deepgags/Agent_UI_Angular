import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { brokerGuard } from "./guards/broker.guard";
import { SiteDataResolver } from "./resolvers/site-data.resolver";

export const routes: Routes = [
	{
		path: "register",
		loadComponent: () => import("./pages/public/register/register.component").then((c) => c.RegisterComponent),
	},
	{
		path: "login",
		loadComponent: () => import("./pages/public/login/login.component").then((c) => c.LoginComponent),
	},
	{
		path: "forgot-password",
		loadComponent: () => import("./pages/public/forgot/forgot.component").then((c) => c.ForgotComponent),
	},
	{
		path: "templates",
		canActivate: [authGuard],
		loadComponent: () => import("./pages/public/templates/templates.component").then((c) => c.TemplatesComponent),
	},
	{
		path: "verify",
		loadComponent: () =>
			import("./pages/public/verify-email/verify-email.component").then((c) => c.VerifyEmailComponent),
	},
	{
		path: "thanks",
		loadComponent: () => import("./components/thankyou/thankyou.component").then((c) => c.ThankyouComponent),
	},
	{
		path: "user-login",
		loadComponent: () => import("./pages/public/user-login/user-login.component").then((c) => c.UserLoginComponent),
	},
	{
		path: "user-signup",
		loadComponent: () =>
			import("./pages/public/user-signup/user-signup.component").then((c) => c.UserSignupComponent),
	},
	{
		path: "agent-landing",
		loadComponent: () =>
			import("./pages/public/agent-landing/agent-landing.component").then((c) => c.AgentLandingComponent),
	},
	{
		path: "deal-centre",
		loadComponent: () =>
			import("./pages/public/deal-centre/deal-centre.component").then((c) => c.DealCentreComponent),
	},
	{
		path: "home-worth",
		loadComponent: () => import("./pages/public/home-worth/home-worth.component").then((c) => c.WorthComponent),
	},
	{
		path: "dream-home",
		loadComponent: () => import("./pages/public/dream-home/dream-home.component").then((c) => c.DreamComponent),
	},
	{
		path: "home-detail",
		loadComponent: () =>
			import("./pages/public/home-detail/home-detail.component").then((c) => c.HomeDetailComponent),
	},
	{
		path: "neighbor-detail",
		loadComponent: () =>
			import("./pages/public/neighbor-detail/neighbor-detail.component").then((c) => c.NeighborDetailComponent),
	},
	{
		path: "home-review",
		loadComponent: () =>
			import("./pages/public/home-review/home-review.component").then((c) => c.HomeReviewComponent),
	},
	{
		path: "",
		loadComponent: () => import("./pages/private/private.component").then((c) => c.PrivateComponent),
		resolve: { siteData: SiteDataResolver },
		children: [
			{
				path: "dashboard",
				loadComponent: () =>
					import("./pages/private/dashboard/dashboard.component").then((c) => c.AdminComponent),
			},
			{
				path: "leads",
				loadComponent: () => import("./pages/private/leads/leads.component").then((c) => c.LeadsComponent),
			},
			{
				path: "testimonial",
				loadComponent: () =>
					import("./pages/private/testimonial/testimonial.component").then((c) => c.TestimonialComponent),
			},
			{
				path: "cities",
				loadComponent: () => import("./pages/private/cities/cities.component").then((c) => c.CitiesComponent),
			},
			{
				path: "settings",
				loadComponent: () =>
					import("./pages/private/settings/settings.component").then((c) => c.SettingsComponent),
			},
			{
				path: "old-manager",
				loadComponent: () =>
					import("./pages/private/manager/manager.component").then((c) => c.ManagerComponent),
			},
			{
				path: "page-manager",
				loadComponent: () =>
					import("./pages/private/page-manager/page-manager.component").then((c) => c.PageManagerComponent),
			},
			{
				path: "menu-manager",
				loadComponent: () =>
					import("./pages/private/menu-manager/menu-manager.component").then((c) => c.MenuManagerComponent),
			},
			{
				path: "template",
				loadComponent: () =>
					import("./pages/private/template/template.component").then((c) => c.TemplateComponent),
			},
			{
				path: "payment",
				loadComponent: () =>
					import("./pages/private/payment/payment.component").then((c) => c.PaymentComponent),
			},
			{
				path: "users",
				loadComponent: () => import("./pages/private/users/users.component").then((c) => c.UsersComponent),
			},
			{
				path: "manage-team",
				loadComponent: () => import("./pages/private/team/team.component").then((c) => c.TeamComponent),
				canActivate: [brokerGuard],
			},
		],
		canActivate: [authGuard],
	},
	{
		path: "**",
		loadComponent: () => import("./pages/public/not-found/not-found.component").then((c) => c.NotFoundComponent),
	},
];
