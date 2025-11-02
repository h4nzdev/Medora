import ayham from "../../assets/ayham.jpg";
import heart from "../../assets/heart.jpg";
import hanz from "../../assets/hanz.jpg";

const Team = () => {
  return (
    <section
      id="team"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative"
      style={{
        backgroundImage: `url(/placeholder.svg?height=1000&width=1600&query=professional+modern+gradient+mesh+cyan+blue+abstract)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/95 to-white/95"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Meet Our Team
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Passionate healthcare professionals and technology experts working
            together to revolutionize healthcare.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Team Member 1 */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                <div className="text-center">
                  <img src={ayham || "/placeholder.svg"} />
                </div>
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-800 mb-2">
              Ayham Kalsam
            </h4>
            <p className="text-cyan-600 font-semibold">Chief Medical Officer</p>
          </div>

          {/* Team Member 2 */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                <img src={heart || "/placeholder.svg"} alt="" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-800 mb-2">
              Heart Kho
            </h4>
            <p className="text-cyan-600 font-semibold">
              Chief Executive Officer
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-cyan-200 flex items-center justify-center">
                <img src={hanz || "/placeholder.svg"} alt="" />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-slate-800 mb-2">
              Hanz Christian Magbal
            </h4>
            <p className="text-cyan-600 font-semibold">Lead Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
