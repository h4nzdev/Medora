import { Mail, Phone, MapPin } from "lucide-react";
const Contact = () => {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-slate-50 to-white relative"
      style={{
        backgroundImage: `url(/placeholder.svg?height=800&width=1600&query=elegant+dots+grid+pattern+cyan+white+minimal)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 to-white/90"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Get In Touch
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions? We're here to help you on your healthcare journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-3">
              Email Us
            </h4>
            <p className="text-slate-600 mb-4">
              Get in touch with our support team
            </p>
            <a
              href="mailto:medora603@gmail.com"
              className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors duration-200"
            >
              Medora@gmail.com
            </a>
          </div>

          <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
              <Phone className="w-8 h-8 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-3">
              Call Us
            </h4>
            <p className="text-slate-600 mb-4">Speak directly with our team</p>
            <a
              href="tel:09566...message on facebook"
              className="text-cyan-600 font-semibold hover:text-cyan-700 transition-colors duration-200"
            >
              099278***00
            </a>
          </div>

          <div className="text-center p-8 bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-center items-center h-16 w-16 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl mb-6">
              <MapPin className="w-8 h-8 text-cyan-600" />
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-3">
              Visit Us
            </h4>
            <p className="text-slate-600 mb-4">Our headquarters location</p>
            <p className="text-cyan-600 font-semibold">
              Salinas Drive
              <br />
              IT Park, Lahug Cebu City
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
