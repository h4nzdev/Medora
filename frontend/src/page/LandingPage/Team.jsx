import { Linkedin, Github, Mail, Award, Star, Sparkles } from "lucide-react";
import ayham from "../../assets/ayham.jpg";
import heart from "../../assets/heart.jpg";
import hanz from "../../assets/hanz.jpg";

const Team = () => {
  const teamMembers = [
    {
      name: "Ayham Kalsam",
      role: "Chief Medical Officer",
      image: ayham,
      bio: "Board-certified physician with 10+ years of clinical experience and healthcare innovation expertise.",
      skills: ["Medical Strategy", "Patient Care", "Healthcare Innovation"],
      social: {
        linkedin: "#",
        email: "ayham@example.com",
      },
      accent: "from-blue-500 to-cyan-500",
      badge: "Medical Expert",
    },
    {
      name: "Heart Kho",
      role: "Chief Executive Officer",
      image: heart,
      bio: "Visionary leader with 8+ years in healthcare technology and business strategy.",
      skills: ["Business Strategy", "Leadership", "Healthcare Tech"],
      social: {
        linkedin: "#",
        github: "#",
        email: "heart@example.com",
      },
      accent: "from-cyan-500 to-teal-500",
      badge: "Strategic Leader",
    },
    {
      name: "Hanz Christian Magbal",
      role: "Lead Developer",
      image: hanz,
      bio: "Full-stack developer specializing in healthcare applications and scalable systems.",
      skills: ["Full-Stack", "AI/ML", "System Architecture"],
      social: {
        linkedin: "#",
        github: "#",
        email: "hanz@example.com",
      },
      accent: "from-teal-500 to-emerald-500",
      badge: "Tech Innovator",
    },
  ];

  return (
    <section
      id="team"
      className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-4 h-4" />
              Meet The Experts
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Our Leadership Team
          </h3>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Passionate healthcare professionals and technology experts working
            together to revolutionize patient care through innovation.
          </p>
        </div>

        {/* Enhanced Team Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-cyan-300 overflow-hidden"
            >
              {/* Background Gradient Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${member.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>

              {/* Card Content */}
              <div className="relative p-8">
                {/* Image Container */}
                <div className="relative mb-8">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300 border-4 border-white overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      <Star className="w-3 h-3" />
                      {member.badge}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="p-2 bg-slate-100 hover:bg-cyan-100 text-slate-600 hover:text-cyan-600 rounded-full transition-all duration-200"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="p-2 bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white rounded-full transition-all duration-200"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-full transition-all duration-200"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-slate-900 transition-colors">
                    {member.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${member.accent} rounded-full`}
                    ></div>
                    <p className="text-cyan-600 font-semibold text-lg">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200 group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r ${member.accent} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-200 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-200 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
            </div>
          ))}
        </div>

        {/* Team Stats */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-cyan-600 mb-2">50+</div>
              <div className="text-slate-600 text-sm font-medium">
                Years Combined Experience
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-slate-600 text-sm font-medium">
                Patients Served
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-teal-600 mb-2">15+</div>
              <div className="text-slate-600 text-sm font-medium">
                Industry Awards
              </div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                24/7
              </div>
              <div className="text-slate-600 text-sm font-medium">
                Dedicated Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
