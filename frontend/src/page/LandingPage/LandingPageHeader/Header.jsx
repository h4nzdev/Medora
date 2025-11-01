import { Menu, X } from "lucide-react";
import logo from "../../../assets/medoralogo1.png";

const Header = ({ isMenuOpen, setIsMenuOpen, scrollToSection }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="logo"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold text-cyan-400 tracking-tight">
              Medora
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("subscriptions")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("clinics")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Clinics
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Team
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Contact
            </button>
            <a
              href="/client/login"
              className="text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200"
            >
              Login
            </a>
            <a
              href="/client/register"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
            <nav className="flex flex-col gap-4 pt-4">
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("subscriptions")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("clinics")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Clinics
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Team
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200"
              >
                Contact
              </button>
              <a
                href="/client/login"
                className="text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200"
              >
                Login
              </a>
              <a
                href="/client/register"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg text-center"
              >
                Get Started
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
