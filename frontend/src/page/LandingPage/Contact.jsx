import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Users,
  Sparkles,
  Send,
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get detailed responses from our support team",
      details: "Medora@gmail.com",
      link: "mailto:medora603@gmail.com",
      badge: "Fast Response",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with healthcare specialists",
      details: "099278***00",
      link: "tel:09927800000",
      badge: "24/7 Available",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Meet our team at headquarters",
      details: "Salinas Drive, IT Park, Lahug Cebu City",
      link: "#",
      badge: "Open Hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant messaging with our team",
      details: "Available 24/7",
      link: "#",
      badge: "Instant Help",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-4 h-4" />
              We're Here to Help
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Get In Touch
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Have questions? Our dedicated team is ready to assist you on your
            healthcare journey.
          </p>
        </div>

        {/* Contact Form + Info Layout */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Left Side */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="mb-8">
              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                Send us a Message
              </h4>
              <p className="text-slate-600">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </div>

          {/* Contact Info - Right Side */}
          <div className="space-y-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 p-6 hover:border-cyan-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {method.title}
                      </h4>
                      <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full text-xs font-semibold border border-cyan-200 flex-shrink-0 ml-2">
                        <Clock className="w-3 h-3" />
                        {method.badge}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-3">
                      {method.description}
                    </p>

                    {method.link !== "#" ? (
                      <a
                        href={method.link}
                        className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 block"
                      >
                        {method.details}
                      </a>
                    ) : (
                      <p className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {method.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Contact;
