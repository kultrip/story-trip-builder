import React from "react";
import WidgetPreview from "../components/WidgetPreview";
import Calculator from "../components/Calculator";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header / Nav would be here (import your NavBar) */}
      <header className="pt-16 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold">Turn stories into bookings</h1>
              <p className="text-gray-600 mt-2 max-w-xl">
                Kultrip converts book, film and story inspirations into agency-branded itineraries that lift lead conversions by 150%+.
              </p>

              <div className="mt-4 flex gap-3">
                <a href="#widget" className="px-4 py-2 bg-kultrip-purple text-white rounded">Try the widget</a>
                <a href="#calculator" className="px-4 py-2 border rounded">See your ROI</a>
              </div>
            </div>

            {/* Mini widget preview in hero (optional) */}
            <div className="w-full md:w-1/2">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-sm text-gray-500">Mini widget preview</p>
                {/* You can render a very small preview or CTA that opens WidgetPreview in a modal */}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Social proof */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-gray-500">Trusted by travel agencies in pilots: +150% lead lift</div>
        </div>
      </section>

      {/* Features / How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-white rounded shadow">1. Share a story → 2. AI crafts itinerary → 3. Export & share</div>
            <div className="p-4 bg-white rounded shadow">Custom branding & multi-format export</div>
            <div className="p-4 bg-white rounded shadow">Integrations for booking & CRM</div>
          </div>
        </div>
      </section>

      {/* Full widget section */}
      <section id="widget" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Try the widget</h2>
          <WidgetPreview />
        </div>
      </section>

      {/* Calculator section */}
      <section id="calculator" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <Calculator />
        </div>
      </section>

      {/* Pricing / Testimonials / FAQ / Footer sections go here */}
      <footer className="py-12 text-center text-sm text-gray-500">© Kultrip</footer>
    </main>
  );
}
