import { Mail, Phone, MapPin, Shield, Award } from "lucide-react";
import logo from "../../assets/medoralogo1.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={logo || "/placeholder.svg"}
                alt="logo"
                className="w-10 h-10"
              />
              <h3 className="text-2xl font-bold">Medora</h3>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-md">
              Revolutionizing healthcare through innovative technology, making
              quality medical care accessible to everyone, everywhere.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <Award className="w-5 h-5" />
                <span className="text-sm">ISO 27001 Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/client/register"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Get Started
                </a>
              </li>
              <li>
                <a
                  href="/client/login"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Patient Login
                </a>
              </li>
              <li>
                <a
                  href="/clinic/login"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Clinic Portal
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>support@Medora.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>+1 (800) Medora-1</span>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                <span>
                  123 Healthcare Ave
                  <br />
                  Medical District, CA 90210
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400">© 2025 Medora. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a
              href="/terms"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies"
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
