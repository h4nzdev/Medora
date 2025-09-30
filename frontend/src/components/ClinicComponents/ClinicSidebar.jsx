import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  Stethoscope,
  ChevronDown,
  Calendar1,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "sonner";
import logo from "../../assets/medoralogo2.png";

export default function ClinicSidebar() {
  const { user } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(null);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/clinic/dashboard",
    },
    {
      icon: Calendar1,
      label: "Calendar",
      link: "/clinic/calendar",
    },
    {
      icon: UserCheck,
      label: "Doctors",
      link: "/clinic/doctors",
    },
    {
      icon: FileText,
      label: "Medical Records",
      link: "/clinic/medical-records",
    },
    {
      icon: Settings,
      label: "Settings",
      link: "/clinic/settings",
    },
    {
      icon: CreditCard,
      label: "Payments",
      type: "dropdown",
      items: [
        {
          label: "Subscription",
          link: "/clinic/subscriptions",
        },
        {
          label: "Invoices",
          link: "/clinic/invoices",
        },
      ],
    },
    {
      icon: Calendar,
      label: "Appointments",
      type: "dropdown",
      items: [
        {
          label: "All Appointments",
          link: "/clinic/appointments",
        },
        {
          label: "Pending Appointments",
          link: "/clinic/pending-appointments",
        },
      ],
    },
    {
      icon: Users,
      label: "Patients",
      type: "dropdown",
      items: [
        {
          label: "All Patients",
          link: "/clinic/patients",
        },
        {
          label: "Patient Chats",
          link: "/clinic/patients-chats",
        },
      ],
    },
  ];

  const path = useLocation();
  const navigate = useNavigate();
  const { setUser, setRole } = useContext(AuthContext);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");
        setUser(false);
        setRole("Clinic");
        navigate("/auth/login");
        toast.success("Logout successfully!");
      }
    });
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const isItemActive = (item) => {
    if (item.link) {
      return path.pathname === item.link;
    }
    if (item.items) {
      return item.items.some((subItem) => path.pathname === subItem.link);
    }
    return false;
  };

  const isSubItemActive = (link) => {
    return path.pathname === link;
  };

  return (
    <div className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col">
      {/* Sidebar Header - Fixed at top */}
      <div className="flex items-center space-x-3 p-6 border-b flex-shrink-0">
        <img src={logo} alt="medoralogo" className="w-12 h-12" />
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            Medora{" "}
            <span className="relative font-medium text-slate-600 capitalize">
              {user.subscriptionPlan}
              <span className="absolute top-0 -right-3 h-3 w-3 bg-green-500 rounded-full"></span>
            </span>
          </h1>
          <p className="text-sm text-slate-500">Clinic Management</p>
        </div>
      </div>

      {/* Navigation Menu - Scrollable if content overflows */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.type === "dropdown" ? (
              <div>
                <button
                  onClick={() => toggleDropdown(index)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isItemActive(item)
                      ? "bg-cyan-600 text-white shadow-md transform scale-105"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  {openDropdown === index ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {openDropdown === index && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <Link to={subItem.link} key={subIndex} className="block">
                        <button
                          className={`w-full flex items-center space-x-3 p-2 pl-6 rounded-lg transition-all duration-200 text-left text-sm ${
                            isSubItemActive(subItem.link)
                              ? "bg-cyan-100 text-cyan-700 border-l-2 border-cyan-600"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                          }`}
                        >
                          <span className="font-medium">{subItem.label}</span>
                        </button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link to={item.link} className="block">
                <button
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                    isItemActive(item)
                      ? "bg-cyan-600 text-white shadow-md transform scale-105"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile & Logout - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t bg-white absolute bottom-0">
        <div className="flex items-center space-x-3 p-3 mb-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">DC</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">
              {user.contactPerson}
            </h3>
            <p className="text-sm text-slate-500">Admin</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
