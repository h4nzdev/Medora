import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FileText,
  Bell,
  LogOut,
  Stethoscope,
  User,
  Settings,
  Clock,
  ChevronDown,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "react-toastify";
import logo from "../../assets/medoralogo2.png";

export default function ClientSidebar() {
  const { user, initials } = useContext(AuthContext);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/client/dashboard" },
    { icon: Clock, label: "Timeline", link: "/client/timeline" },
    {
      icon: Calendar,
      label: "Appointments",
      type: "dropdown",
      items: [
        { label: "My Appointments", link: "/client/appointments" },
        { label: "Find Doctors", link: "/client/doctors" },
      ],
    },
    { icon: MessageSquare, label: "AI Chat", link: "/client/chats" },
    {
      icon: FileText,
      label: "Health Records",
      type: "dropdown",
      items: [
        { label: "Medical Records", link: "/client/medical-records" },
        { label: "Reminders", link: "/client/reminders" },
        { label: "Invoices", link: "/client/invoices" },
      ],
    },
    {
      icon: User,
      label: "Account",
      type: "dropdown",
      items: [
        { label: "Profile", link: "/client/profile" },
        { label: "Settings", link: "/client/settings" },
      ],
    },
    { icon: Bell, label: "Notifications", link: "/client/notifications" },
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
        setRole("Client");
        navigate("/auth/login");
        toast.success("Logged out successfully!");
      }
    });
  };

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col">
      <div className="flex items-center space-x-3 p-6 border-b flex-shrink-0">
        <img src={logo} alt="medoralogo" className="w-12 h-12" />
        <div>
          <h1 className="text-lg font-bold text-slate-800">Medora</h1>
          <p className="text-sm text-slate-500">Client Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scroll">
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
                  {openDropdowns[index] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {openDropdowns[index] && (
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

      <div className="flex-shrink-0 p-4 border-t bg-white">
        <div className="flex items-center space-x-3 p-3 mb-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>
          <div>
            <h3 className="turnicate max-w-[150px] font-semibold text-slate-800">
              {user.name}
            </h3>
            <p className="text-sm text-slate-500">Patient</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
