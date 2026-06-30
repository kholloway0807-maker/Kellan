import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Free Estimate | Lawn Care Bloomington-Normal IL",
  description:
    "Contact Kellan Holloway Lawncare for a free lawn care estimate in Bloomington-Normal and McLean County, IL. Call (309) 555-0100 or fill out our quick form.",
};

const serviceAreaTowns = [
  "Bloomington", "Normal", "Chenoa", "LeRoy", "Heyworth",
  "Lexington", "Downs", "Hudson", "Towanda", "Gridley",
  "Danvers", "McLean", "Carlock", "Stanford", "Shirley",
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20" aria-labelledby="contact-page-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Reach Out</p>
          <h1 id="contact-page-heading" className="text-4xl font-extrabold text-cream sm:text-5xl mb-4">
            Get Your Free Estimate
          </h1>
          <p className="text-cream/70 max-w-xl text-lg">
            No obligation. No pressure. We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact split */}
      <section className="py-20 bg-cream" aria-labelledby="contact-form-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 id="contact-info-heading" className="text-xl font-extrabold text-green mb-4">
                  Contact Info
                </h2>
                <ul className="space-y-4 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-green">Phone / Text</p>
                      <a href="tel:+13095550100" className="text-gold font-bold text-base hover:text-gold-dark transition-colors">
                        (309) 555-0100
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-green">Email</p>
                      <a href="mailto:kellan@kellanlawncare.com" className="text-gray-700 hover:text-green transition-colors">
                        kellan@kellanlawncare.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-green">Based In</p>
                      <p>Bloomington-Normal, IL</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-green mb-3">Hours</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex justify-between"><span>Mon – Fri</span><span className="font-medium">7am – 6pm</span></li>
                  <li className="flex justify-between"><span>Saturday</span><span className="font-medium">8am – 2pm</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span className="font-medium text-gray-400">Closed</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-green mb-3">Service Area</h3>
                <ul className="grid grid-cols-2 gap-1" aria-label="Towns we service">
                  {serviceAreaTowns.map((town) => (
                    <li key={town} className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                      {town}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 id="contact-form-heading" className="text-xl font-extrabold text-green mb-6">
                Request a Free Estimate
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
