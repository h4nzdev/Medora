import ClinicCard from "./components/ClinicCard";
import { Users } from "lucide-react";
import clinic from "../../../assets/clinic.jpg";

const FeaturedClinics = ({ clinics, loading }) => {
  // Debug: Check what's actually in the clinics array
  console.log("Clinics data:", clinics);
  console.log("Number of clinics:", clinics?.length);

  return (
    <section
      id="clinics"
      className="py-24 bg-slate-50 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${clinic})` }}
    >
      <div className="absolute bg-black/50 inset-0"></div>
      <div className="container mx-auto px-6 z-40 relative">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Clinics
          </h3>
          <p className="text-xl text-slate-100 max-w-2xl mx-auto">
            Discover healthcare providers using our platform
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-white">Loading clinics...</p>
            </div>
          </div>
        )}

        {/* No Clinics */}
        {!loading && (!clinics || clinics.length === 0) && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">
                Coming Soon!
              </h4>
              <p className="text-slate-600">
                More clinics are joining our platform every day.
              </p>
            </div>
          </div>
        )}

        {/* Horizontal Scroll for Mobile, Grid for Desktop */}
        {!loading && clinics && clinics.length > 0 && (
          <>
            {/* Mobile - Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto pb-6 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide gap-4">
                {clinics
                  .filter(
                    (clinic, index, self) =>
                      index === self.findIndex((c) => c._id === clinic._id)
                  )
                  .slice(0, 3)
                  .map((clinic) => (
                    <div
                      key={clinic._id}
                      className="flex-shrink-0 w-[85vw] snap-center"
                    >
                      <ClinicCard clinic={clinic} />
                    </div>
                  ))}
              </div>
              <div className="text-center mt-4 text-sm text-white/80">
                Swipe to see more clinics
              </div>
            </div>

            {/* Desktop - Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics
                .filter(
                  (clinic, index, self) =>
                    index === self.findIndex((c) => c._id === clinic._id)
                )
                .slice(0, 3)
                .map((clinic) => (
                  <ClinicCard key={clinic._id} clinic={clinic} />
                ))}
            </div>
          </>
        )}

        {/* Simple CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-100 mb-6">
            Want your clinic to be featured here?
          </p>
          <a
            href="/clinic/register"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
          >
            Register Your Clinic
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClinics;
