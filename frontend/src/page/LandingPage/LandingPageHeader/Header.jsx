import { ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../../assets/medoralogo1.png";

const Header = ({ isMenuOpen, setIsMenuOpen, scrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "Clinics", id: "clinics" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQ", id: "faq" },
    { label: "Team", id: "team" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/80 py-2"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-200/50 py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="Medora Logo"
              className={`transition-all duration-300 ${
                isScrolled ? "w-8 h-8" : "w-10 h-10"
              } group-hover:scale-110`}
            />
            <div className="flex flex-col">
              <h1
                className={`font-bold text-cyan-500 tracking-tight transition-all duration-300 ${
                  isScrolled ? "text-xl" : "text-2xl"
                } group-hover:text-cyan-600`}
              >
                Medora
              </h1>
              <span className="text-xs text-slate-400 -mt-1 hidden sm:block">
                Your Personal Health Care
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-2 text-slate-600 hover:text-cyan-600 font-medium transition-all duration-200 rounded-lg hover:bg-cyan-50 relative group"
              >
                {item.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
            ))}

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
              <a
                href="/client/login"
                className="px-4 py-2 text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                Login
              </a>
              <a
                href="/client/register"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </nav>

          {/* Tablet Navigation (simplified) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200 rounded-lg text-sm"
              >
                {item.label}
              </button>
            ))}

            {/* More dropdown for tablet */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-2 text-slate-600 hover:text-cyan-600 font-medium transition-colors duration-200 rounded-lg text-sm flex items-center gap-1"
              >
                More
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  {navItems.slice(4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons for tablet */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <a
                href="/client/login"
                className="px-3 py-2 text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200 rounded-lg text-sm"
              >
                Login
              </a>
              <a
                href="/client/register"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200/80 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col gap-1 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 text-slate-600 hover:text-cyan-600 font-medium transition-all duration-200 rounded-lg hover:bg-cyan-50 hover:pl-6 flex items-center group"
                >
                  {item.label}
                  <span className="ml-auto text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    →
                  </span>
                </button>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-slate-200/80">
                <a
                  href="/client/login"
                  className="text-center px-4 py-3 text-slate-600 hover:text-cyan-600 font-semibold transition-colors duration-200 rounded-lg hover:bg-slate-50 border border-slate-200"
                >
                  Login
                </a>
                <a
                  href="/client/register"
                  className="text-center bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95 hover:shadow-xl"
                >
                  Get Started Free
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
