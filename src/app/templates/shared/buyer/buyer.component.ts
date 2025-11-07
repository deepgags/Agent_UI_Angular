import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { SiteConfig } from "../../../models/SiteConfig";
import { SharedDataService } from "../../../services/shareddata.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-buyer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./buyer.component.html",
  styleUrls: ["./buyer.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BuyerComponent implements OnInit {
  siteConfig: SiteConfig = {} as SiteConfig;

  buyerText = `
<div class="container search-container">
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
          <div class="accordion mb-5" id="faqAccordion">
            <h4 class="info fw-bold mb-4">Frequently Asked Questions</h4>
            <h5 class="info fw-bold mb-2">What is the buying process?</h5>
            <p class="accordion-body">
              The buying process typically includes property selection, making an offer, meeting conditions, and closing the deal with legal documentation.
            </p>

            <h5 class="info fw-bold mb-2">How do I evaluate properties?</h5>
            <p class="accordion-body">
              Evaluate properties based on location, condition, price, and amenities. Hire an inspector for deeper insights.
            </p>
          </div>

          <!-- Section: What’s Out There -->
          <div class="mb-5">
            <h4 class="info fw-bold mb-2">What’s Out There?</h4>
            <p class="text-muted">
              While the market includes new and resale homes, resale properties are often located in established neighborhoods with mature landscaping and nearby amenities.
            </p>
            <p class="text-muted">
              Keep in mind, resale homes have weathered time — with potential signs of aging like settling or minor wear.
            </p>
            <p class="text-muted">
              MLS® systems make your search easier. Realtors can generate lists based on your criteria, complete with photos, area maps, and even interior views. You can also explore listings at <strong>mls.ca</strong>.
            </p>
          </div>

          <!-- Section: Testimonials Carousel -->
          <div id="testimonialCarousel" class="carousel slide mb-5" data-bs-ride="carousel">
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
            <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
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
            <p class="text-muted">Your offer should outline:</p>
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
</div>
`;

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    this.siteConfig = this.sharedDataService.siteData();
  }
}
