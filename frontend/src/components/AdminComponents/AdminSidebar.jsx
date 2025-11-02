import {
  LayoutDashboard,
  LogOut,
  User,
  Building,
  IndentDecrease,
  MessageSquare,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "sonner";
import logo from "../../assets/medoralogo1.png";
import { getInitials } from "../../utils/getInitials";

export default function AdminSidebar() {
  const { user, initials, logout } = useContext(AuthContext);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", link: "/admin/dashboard" },
    { icon: Building, label: "Clinics", link: "/admin/clinics" },
    { icon: User, label: "Patients", link: "/admin/patients" },
    { icon: MessageSquare, label: "FeedBacks", link: "/admin/feedback" },
  ];

  const path = useLocation();
  const navigate = useNavigate();

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
        logout();
        navigate("/admin/login");
        toast.success("Logged out successfully!");
      }
    });
  };

  const isItemActive = (item) => {
    return path.pathname === item.link;
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg z-50 flex flex-col">
      <div className="flex items-center space-x-3 p-6 border-b  flex-shrink-0">
        <img src={logo} alt="medoralogo" className="w-12 h-12" />
        <div>
          <h1 className="text-lg font-bold text-slate-800">Medora</h1>
          <p className="text-sm text-slate-500">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto hide-scroll">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index} className="block">
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
        ))}
      </nav>

      <div className="flex-shrink-0 p-4 border-t bg-white">
        <div className="flex items-center space-x-3 p-3 mb-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getInitials(user.admin_name)}
            </span>
          </div>
          <div>
            <h3 className="turnicate max-w-[150px] font-semibold text-slate-800">
              {user?.name || "Admin User"}
            </h3>
            <p className="text-sm text-slate-500">Admin</p>
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
