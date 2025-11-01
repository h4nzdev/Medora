import React from "react";

const FAQ = () => {
  return (
    <section
      id="faq"
      className="py-24 bg-white relative"
      style={{
        backgroundImage: `url(/placeholder.svg?height=1000&width=1600&query=medical+heartbeat+pulse+pattern+light+cyan+minimal)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/92"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about Medora and how it works
          </p>
        </div>

        <div className="mx-auto space-y-4">
          {/* FAQ Item 1 */}
          <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="text-lg font-semibold text-slate-800">
                How does the AI Symptom Checker work?
              </h4>
              <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Our AI Symptom Checker uses advanced machine learning algorithms
              to analyze your symptoms and provide preliminary health insights.
              Simply describe your symptoms, and our AI will ask relevant
              follow-up questions to better understand your condition before
              providing recommendations.
            </p>
          </details>

          {/* FAQ Item 2 */}
          <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="text-lg font-semibold text-slate-800">
                Is my medical data secure?
              </h4>
              <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Absolutely. Medora is HIPAA compliant and uses bank-level
              encryption to protect your medical records. Your data is stored
              securely and never shared with third parties without your explicit
              consent.
            </p>
          </details>

          {/* FAQ Item 3 */}
          <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="text-lg font-semibold text-slate-800">
                How do I book an appointment?
              </h4>
              <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Booking an appointment is simple! Browse our featured clinics,
              select your preferred healthcare provider, and click "Book
              Appointment." You'll be able to view available time slots and
              confirm your booking instantly.
            </p>
          </details>

          {/* FAQ Item 4 */}
          <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="text-lg font-semibold text-slate-800">
                Can clinics join Medora?
              </h4>
              <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Yes! Healthcare providers and clinics can register on Medora to
              manage appointments, patient records, and streamline their
              operations. We offer different subscription plans including Basic
              and Pro to suit your clinic's needs.
            </p>
          </details>

          {/* FAQ Item 5 */}
          <details className="group bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-200">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h4 className="text-lg font-semibold text-slate-800">
                Is Medora available 24/7?
              </h4>
              <span className="text-cyan-600 text-2xl group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Yes! Our AI Symptom Checker and platform features are available
              24/7. While individual clinic hours may vary, you can always
              access your medical records, book future appointments, and get
              AI-powered health insights anytime.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
