import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { EditorModule } from "primeng/editor";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import { CustomerService } from "../../../services/customer.service";
import { LoadingService } from "../../../services/loading.service";
import { NotificationService } from "../../../services/notification.service";

@Component({
	selector: "app-manager",
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		SelectModule,
		InputMaskModule,
		IftaLabelModule,
		TextareaModule,
		EditorModule,
		CheckboxModule,
	],
	templateUrl: "./manager.component.html",
	styleUrls: ["./manager.component.scss"],
})
export class ManagerComponent {
	agentForm!: FormGroup;

	defaultABoutText = `I believe every client has the right to be treated fairly, honestly and with integrity. My aim is to educate and prepare my clients to insure that they are always in a position to make informed decisions. Every engagement is an opportunity to create a lasting impression and a forever client. Ajay is a well serving in real estate with the reputation of providing quality services and keeping excellent relations with the clients. My intend to provide our clients with the best personalized real estate experience from beginning to end. I enjoy sharing my expertise by giving you the scoop on the local real estate market. My aim is to guide & prepare our clients to ensure that they are always in a position to make informed decision. I put our client’s interest above everything. I am professionally trained and licensed realtors who work for seeking to experience satisfaction and feel good emotions.`;

	defaultContactText = `Your way to better real estate software starts here. For 35 years, we’ve proudly delivered the gold standard in real estate software to businesses of all shapes, sizes, and structures, and we’d be honored to partner with your organization today.`;

	defaultBuyerText = `<div class="container search-container">
		<section class="bg-light py-5">
			<div class="container">
			<div class="row">
				<div class="col">
				<!-- Section: What Do You Want -->
				<div class="mb-5">
					<h4 class="info fw-bold mb-2">What Do You Want?</h4>
					<p class="text-muted">Begin by listing your needs:</p>
					<ul class="text-muted">
					<li>Living requirements (e.g. number of bedrooms)</li>
					<li>Family size</li>
					<li>What you’re bringing from your current home</li>
					<li>Proximity to schools, shopping, and services</li>
					<li>Your affordable down payment</li>
					<li>Target price range</li>
					</ul>
					<p class="text-muted">
					Be realistic about your budget. A trusted real estate professional can help you evaluate what fits within your financial comfort zone.
					</p>
				</div>
				<!-- New Component: FAQ Accordion -->
				<div class="accordion mb-5"
					id="faqAccordion">
					<h4 class="info fw-bold mb-4">Frequently Asked Questions</h4>
					<h5 class="info fw-bold mb-2">
					What is the buying process?
					</h5>
					<p class="accordion-body">
					The buying process typically includes property selection, making an offer, meeting conditions, and closing the deal with legal documentation.
					</p>

					<h5 class="info fw-bold mb-2">
					How do I evaluate properties?
					</h5>
					<p class="accordion-body">
					Evaluate properties based on location, condition, price, and amenities. Hire an inspector for deeper insights.
					</p>
				</div>

				<div class="mb-5">
					<h4 class="info fw-bold mb-2">What’s Out There?</h4>
					<p class="text-muted">
					While the market includes new and resale homes, resale properties are often located in established neighborhoods with mature landscaping and nearby
					amenities.
					</p>
					<p class="text-muted">
					Keep in mind, resale homes have weathered time — with potential signs of aging like settling or minor wear.
					</p>
					<p class="text-muted">
					MLS® systems make your search easier. Realtors can generate lists based on your criteria, complete with photos, area maps, and even interior views. You
					can also explore listings at <strong>mls.ca</strong>.
					</p>
				</div>
				<div id="testimonialCarousel"
					class="carousel slide mb-5"
					data-bs-ride="carousel">
					<h4 class="info fw-bold mb-2">Client Testimonials</h4>
					<div class="carousel-inner">
					<div class="carousel-item active">
						<p class="text-muted">"We had a fantastic experience. Found the perfect home quickly!" - John Doe</p>
					</div>
					<div class="carousel-item">
						<p class="text-muted">"Highly recommend this brokerage for all real estate needs." - Jane Smith</p>
					</div>
					<div class="carousel-item">
						<p class="text-muted">"Professional and efficient service." - Adam Johnson</p>
					</div>
					</div>
					<button class="carousel-control-prev"
							type="button"
							data-bs-target="#testimonialCarousel"
							data-bs-slide="prev">
					<span class="carousel-control-prev-icon"
							aria-hidden="true"></span>
					<span class="visually-hidden">Previous</span>
					</button>
					<button class="carousel-control-next"
							type="button"
							data-bs-target="#testimonialCarousel"
							data-bs-slide="next">
					<span class="carousel-control-next-icon"
							aria-hidden="true"></span>
					<span class="visually-hidden">Next</span>
					</button>
				</div>
				<!-- Section: Touring a House -->
				<div class="mb-5">
					<h4 class="info fw-bold mb-2">Touring a House</h4>
					<p class="text-muted">When visiting a property, consider the following:</p>
					<ul class="text-muted">
					<li>Type of wiring and electrical panel (fuses or breakers?)</li>
					<li>Heating system (type and condition)</li>
					<li>Roof and foundation status</li>
					<li>Plumbing quality</li>
					<li>Types and locations of power outlets</li>
					</ul>
					<p class="text-muted">
					If you’re unsure what to look for, consider hiring a professional home inspector — it’s a worthwhile investment.
					</p>
				</div>
				<!-- Section: Making an Offer -->
				<div class="mb-4">
					<h4 class="info fw-bold mb-2">Making an Offer</h4>
					<p class="text-muted">
					Your offer should outline:
					</p>
					<ul class="text-muted">
					<li>Your proposed purchase price</li>
					<li>Preferred closing date</li>
					<li>Any conditions (like home inspection, financing)</li>
					<li>Offer expiration timeline</li>
					</ul>
					<p class="text-muted">
					A deposit accompanies the offer as a show of good faith. Once accepted and conditions are met, the agreement becomes legally binding.
					Make sure you fully understand the terms before signing. Backing out after acceptance may cost you your deposit or result in legal action.
					</p>
				</div>
				</div>
			</div>
			</div>
		</section>
		</div>`;

	defaultSellerText = `<div class="container pb-5 search-container">
		<h2 class="my-5 mb-4 info">Completing a Listing Agreement</h2>
		<hr>
		<h3 class="info">What is a Listing Agreement?</h3>
		<p>A listing agreement is a contract between you and the brokerage company that the agent represents. It is a framework for subsequent forms and negotiations. It’s important
			the agreement accurately reflects your property and clearly spells out the rights and obligations of all parties, including what is included or excluded in the deal.</p>
		<h3 class="info">What Happens?</h3>
		<p>Both you and the listing agent sign the agreement and each receive a copy. The agreement binds both parties to its terms and conditions. Whether or not you wish your lawyer
			to review the agreement, you should inform them that you’re selling your home.</p>
		<h3 class="info">The Fine Print</h3>
		<ul>
			<li>Appointment of the brokerage company as your agent</li>
			<li>Duration of the agreement</li>
			<li>Compensation details (typically paid upon closing)</li>
			<li>Listing price</li>
			<li>Property description: lot size, building size and style, materials, room sizes, heating/cooling systems</li>
			<li>Inclusions and exclusions (fixtures usually stay; chattels usually go)</li>
			<li>Financial details: mortgage balance, monthly payments, due dates, property taxes, easements, liens</li>
		</ul>
		<h3 class="info">Types of Listings</h3>
		<p><strong>Open Listing:</strong> Authority to sell is given to multiple REALTORS. You can also sell the property yourself without owing commission.</p>
		<p><strong>Exclusive Listing:</strong> You appoint one firm to exclusively sell your property.</p>
		<p><strong>MLS® Listing:</strong> A type of exclusive listing that allows broader exposure through the MLS® system and may involve commission sharing.</p>
		<h3 class="info">What is the MLS® System?</h3>
		<p>The MLS® system is a cooperative listing service operated by local real estate boards. It provides exposure to REALTORS and buyers across the country and internationally
			through MLS.ca.</p>
		<h3 class="info">Setting the Asking Price</h3>
		<p>While you may estimate your home’s value, a professional appraisal ensures accuracy. Avoid pricing too high or too low.</p>
		<h3 class="info">Marketing Your Home</h3>
		<p><strong>Open Houses:</strong></p>
		<ul>
			<li><strong>Agent's Open House:</strong> For brokers and REALTORS</li>
			<li><strong>Public Open House:</strong> Open to the general public</li>
		</ul>
		<p><strong>Tips:</strong></p>
		<ul>
			<li>Leave the property during the open house</li>
			<li>Secure valuables</li>
			<li>Keep out of the way if you stay</li>
			<li>Minimize distractions (TV, pets, etc.)</li>
			<li>Direct inquiries to your agent</li>
		</ul>
		<p><strong>Other Tools:</strong></p>
		<ul>
			<li>"For Sale" signs</li>
			<li>Advertising in newspapers and local real estate boards</li>
		</ul>
		<h3 class="info">Renewing the Listing</h3>
		<p>If the home doesn’t sell quickly:</p>
		<ul>
			<li>Review location, condition, and price</li>
			<li>Adjust strategy accordingly</li>
			<li>Discuss with your agent: showings, feedback, market conditions</li>
		</ul>
		<h3 class="info">The Offer</h3>
		<p>An offer outlines:</p>
		<ul>
			<li>Price</li>
			<li>Possession date</li>
			<li>Conditions</li>
			<li>Expiry date</li>
		</ul>
		<p>A deposit is usually included to show seriousness. Offers can include low offers and conditions. You can counteroffer. Once signed by all parties, it becomes a binding
			contract. Review terms carefully and consult a lawyer if needed.</p>
		<h3 class="info">Before Closing</h3>
		<p>You may need to provide:</p>
		<ul>
			<li>A current survey or property report</li>
			<li>Proof of property ownership</li>
			<li>Health inspection certificate (for septic systems)</li>
			<li>Engineer inspection (if requested)</li>
		</ul>
		<h3 class="info">Closing the Sale</h3>
		<ul>
			<li>Lawyers handle trust accounts, mortgage payouts, and deed transfers</li>
			<li>You provide legal documents and keys</li>
			<li>Lawyers manage reimbursements for prepaid expenses</li>
			<li>Some mortgages are portable to a new home</li>
		</ul>
		<h3 class="info">Final Notes</h3>
		<ul>
			<li>Capital gains from selling your primary residence are tax-exempt</li>
			<li>Keep insurance active until closing</li>
		</ul>
		</div>`;

	defaultSeller2Text = `
		<div class="container pb-5 search-container">
		<h2 class="my-5 mb-4 info">Renovating to Sell</h2>
		<hr>
		<h3 class="info">Plan Smart, Profit More</h3>
		<p>Investing in home improvements doesn’t always mean you’ll recover the full amount when selling. Careful planning is essential if you want to boost your home’s salability and
			potentially profit from your renovations.</p>
		<p>Sometimes, the least expensive upgrades provide the highest return. For example, interior painting can offer an average 75% payback. A $2,000 paint job could increase your
			home's value by up to $3,500.</p>
		<h3 class="info">Best Paint Choices</h3>
		<p>To attract more buyers, choose neutral shades like whites and soft tones of popular colors. Avoid highly personal or custom touches if you're planning to sell soon, as they
			may not appeal to everyone and can hinder a quick sale.</p>
		<h3 class="info">Focus on Kitchens and Bathrooms</h3>
		<p>Renovating key areas like kitchens and bathrooms can pay off significantly. With average returns of 72% and 68% respectively, upgrades such as new fixtures, cabinets, and
			tiles are often worthwhile.</p>
		<h3 class="info">Top Renovations & ROI (1999 AIC Survey)</h3>
		<ul>
			<li>Interior painting and décor – 73%</li>
			<li>Kitchen renovation – 72%</li>
			<li>Bathroom renovation – 68%</li>
			<li>Exterior paint – 65%</li>
			<li>Flooring upgrades – 62%</li>
			<li>Window/door replacement – 57%</li>
			<li>Main floor family room addition – 51%</li>
			<li>Fireplace addition – 50%</li>
			<li>Basement renovation – 49%</li>
			<li>Furnace/heating system replacement – 48%</li>
		</ul>
		<h3 class="info">Simple Fixes, Big Impact</h3>
		<p>Cleaning and decluttering can deliver a huge return with minimal cost. These efforts make your home more inviting and help buyers see its potential.</p>
		<h3 class="info">Landscaping</h3>
		<p>Improving your home’s curb appeal through landscaping is another cost-effective upgrade that can lead to strong returns.</p>
		<h3 class="info">Popular Renovation Trends (2004)</h3>
		<ul>
			<li>Home theatre rooms</li>
			<li>Hardwood flooring in kitchens</li>
			<li>Main floor laundry rooms</li>
			<li>Use of non-neutral interior paint colors</li>
			<li>Jacuzzi or whirlpool bathtubs</li>
			<li>Built-in kitchen appliances</li>
			<li>Ground floor offices</li>
			<li>Kitchen islands</li>
		</ul>
		<h3 class="info">Realtor Insight</h3>
		<p>As a realtor, I can provide personalized recommendations for renovations that will add value to your home and help it sell faster.</p>
		</div>
`;
	defaultSeller3Text = `
<div class="container pb-5 search-container">
	<h2 class="my-5 mb-4 info">Common Home Selling Mistakes</h2>
	<hr>
	<h3 class="info">Incorrect Pricing</h3>
	<p>Every seller wants to maximize their return, but overpricing is one of the most common mistakes. Listings get the most attention shortly after they hit the market. If your
		home is perceived as overpriced, it may be ignored, leading to later price cuts and a lower final sale price.</p>
	<h3 class="info">Mistaking Re-finance Appraisals for Market Value</h3>
	<p>Refinance appraisals are often higher than actual market value because lenders aim to encourage refinancing. Relying on them can mislead sellers. For an accurate valuation,
		ask your Realtor® for recent sales data in your area.</p>
	<h3 class="info">Failing to "Showcase"</h3>
	<p>Appearance matters. Make necessary repairs, clean thoroughly, and declutter before showings. A tidy, well-maintained home helps buyers connect emotionally and envision
		living there.</p>
	<h3 class="info">Trying to "Hard Sell" While Showing</h3>
	<p>Let buyers explore your home freely. Avoid pushy sales tactics. Instead, be warm, point out unique features, and answer questions calmly. This isn’t the time to negotiate —
		it’s the time to make a good impression.</p>
	<h3 class="info">Trying to Sell to Lookers</h3>
	<p>Not everyone who visits is ready to buy. Many lookers are months away from a purchase or may not yet be financially ready. A good Realtor® will pre-qualify leads and focus
		marketing on serious buyers.</p>
	<h3 class="info">Being Ignorant of Your Rights & Responsibilities</h3>
	<p>Understand your real estate contract thoroughly. Know what you're legally responsible for, what “as is” means, and how zoning laws affect the sale. Overlooking these can
		cost you time and money.</p>
	<h3 class="info">Signing a Contract with No Escape</h3>
	<p>You should retain control over your agent relationship. If things aren’t working out, you should have the right to change agents. Avoid contracts that lock you in with no
		flexibility to make a change if needed.</p>
	<h3 class="info">Limited Marketing</h3>
	<p>Open houses and classifieds rarely sell homes. Your Realtor® should utilize diverse marketing methods, including a strong online presence. Make sure they’re accessible
		during key business hours and committed to actively promoting your property.</p>
	<h3 class="info">Choosing the Wrong Realtor®</h3>
	<p>This could be your most important financial transaction. Choose a Realtor® who fits your needs. Interview multiple agents, check experience and ask about their marketing
		strategy. The right agent can help you get more value, faster and with less hassle.</p>
</div>
`;

	constructor(
		private customerService: CustomerService,
		private notificationService: NotificationService,
		private loadingService: LoadingService
	) {}

	ngOnInit() {
		this.agentForm = new FormGroup({
			aboutText: new FormControl(""),
			contactText: new FormControl(""),
			sellingYourHouseText: new FormControl(""),
			renovatingForResellText: new FormControl(""),
			commonSellingMistakeText: new FormControl(""),
			buyerText: new FormControl(""),
			showHomeWorthPage: new FormControl(false),
			showSellingInNeighbourHooddPage: new FormControl(""),
			showFindDreamHomePage: new FormControl(""),
		});

		this.getProfile();
	}

	getProfile() {
		this.customerService.getCustomer().subscribe({
			next: (response: any) => {
				if (response.status) {
					if (response.data.websiteSettings) {
						const {
							aboutText,
							contactText,
							sellingYourHouseText,
							renovatingForResellText,
							commonSellingMistakeText,
							buyerText,
							showHomeWorthPage,
							showSellingInNeighbourHooddPage,
							showFindDreamHomePage,
						} = response.data.websiteSettings;
						this.agentForm.patchValue({
							aboutText: aboutText || this.defaultABoutText,
							contactText: contactText || this.defaultContactText,
							sellingYourHouseText: sellingYourHouseText || this.defaultSellerText,
							renovatingForResellText: renovatingForResellText || this.defaultSeller2Text,
							commonSellingMistakeText: commonSellingMistakeText || this.defaultSeller3Text,
							buyerText: buyerText || this.defaultBuyerText,
							showHomeWorthPage: showHomeWorthPage,
							showSellingInNeighbourHooddPage: showSellingInNeighbourHooddPage,
							showFindDreamHomePage: showFindDreamHomePage,
						});
					}
				}
			},
			error: () => {
				this.notificationService.showSuccess("An error has occurred while getting customer information");
			},
			complete: () => {},
		});
	}

	save() {
		const { valid } = this.agentForm;
		if (valid) {
			this.loadingService.loadingOn();
			const {
				aboutText,
				contactText,
				sellingYourHouseText,
				renovatingForResellText,
				commonSellingMistakeText,
				buyerText,
				showHomeWorthPage,
				showSellingInNeighbourHooddPage,
				showFindDreamHomePage,
			} = this.agentForm.value;
			const params = {
				websiteSettings: {
					aboutText: aboutText,
					contactText: contactText,
					sellingYourHouseText: sellingYourHouseText,
					renovatingForResellText: renovatingForResellText,
					commonSellingMistakeText: commonSellingMistakeText,
					buyerText: buyerText,
					showHomeWorthPage,
					showSellingInNeighbourHooddPage,
					showFindDreamHomePage,
				},
			};
			this.customerService.updatePageContent(params).subscribe({
				next: (v) => {},
				error: (e) => {
					this.notificationService.showError(
						e.error.message || "Something went wrong while updating content."
					);
				},
				complete: () => {
					this.notificationService.showSuccess("Page content updated.");
					this.loadingService.loadingOff();
				},
			});
		} else {
			this.agentForm.markAllAsTouched();
			this.notificationService.showSuccess("One or more required fields are missing or invalid.");
		}
	}
}
