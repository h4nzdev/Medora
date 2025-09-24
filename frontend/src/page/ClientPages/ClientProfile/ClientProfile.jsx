import { useContext, useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Download,
  Edit,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useDate } from "../../../utils/date";
import axios from "axios";

const ClientProfile = () => {
  const { user, initials, setUser } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        name: user.name,
        age: user.age,
        gender: user.gender,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });

      const fetchAppointmentHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/appointment/patient/${user._id}`);
          setAppointmentHistory(response.data);
        } catch (error) {
          console.error("Error fetching appointment history:", error);
        }
      };

      fetchAppointmentHistory();
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/patients/${user._id}`, updatedUser);
      setUser(response.data); // Update user in context
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error display to user
    }
  };


  if (!user) {
    return (
      <div className="w-full min-h-screen bg-slate-50">
        <div className="mx-auto p-4 sm:p-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-slate-200/50">
            <p className="text-slate-600 text-base sm:text-lg">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Full Name",
      value: updatedUser?.name,
      icon: User,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      name: "name",
    },
    {
      title: "Age",
      value: `${updatedUser?.age} years`,
      icon: Calendar,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      name: "age",

    },
    {
      title: "Gender",
      value: updatedUser?.gender,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      name: "gender",

    },
    {
      title: "Role",
      value: user.role,
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      name: "role",
      isEditable: false

    },
  ];

  const contactInfo = [
    {
      title: "Email Address",
      value: updatedUser?.email,
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      name: "email",

    },
    {
      title: "Phone Number",
      value: updatedUser?.phone,
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      name: "phone",

    },
    {
      title: "Address",
      value: updatedUser?.address,
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      name: "address",

    },
  ];


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full flex">
      <div className="mx-auto flex-1">
        {/* Header Section - Enhanced Mobile Typography */}
        <header className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar - Larger on mobile */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-cyan-700 flex items-center justify-center shadow-lg">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
                  {initials}
                </span>
              </div>

              {/* User Info - Larger text on mobile */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                  {user.name}
                </h1>
                <p className="text-slate-600 mt-2 text-lg sm:text-xl font-medium break-all leading-relaxed">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 justify-center sm:justify-start">
                  <span className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold tracking-wide uppercase border border-cyan-200">
                    {user.role}
                  </span>
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold tracking-wide border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              {/* Registration Info - Larger text on mobile */}
              <div className="text-center sm:text-right mt-4 sm:mt-0">
                <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase">
                  Registered Date
                </p>
                <p className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
                  {useDate(user.createdAt)}
                </p>
                <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase mt-3">
                  Patient ID
                </p>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-cyan-700 break-all">{user._id}</p>
                 <button
                  onClick={handleEditClick}
                  className="mt-4 flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 transition-colors px-4 py-2 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                  <span>{isEditMode ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Personal Information Section - Enhanced Mobile Layout */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-4 sm:mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} backdrop-blur-sm rounded-xl p-5 sm:p-6 border ${stat.borderColor} shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase">
                        {stat.title}
                      </p>
                      {isEditMode && stat.isEditable !== false ? (
                        <input
                          type="text"
                          name={stat.name}
                          value={stat.name === 'age' ? parseInt(stat.value) : stat.value}
                          onChange={handleInputChange}
                          className={`text-xl sm:text-2xl font-bold ${stat.color} mt-2 text-balance capitalize leading-tight bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-cyan-500 w-full`}
                        />
                      ) : (
                        <p
                          className={`text-xl sm:text-2xl font-bold ${stat.color} mt-2 text-balance capitalize leading-tight`}
                        >
                          {stat.value}
                        </p>
                      )}
                    </div>
                    <div
                      className={`p-3 sm:p-4 ${stat.bgColor} rounded-lg border ${stat.borderColor}`}
                    >
                      <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Information Section - Enhanced Mobile Layout */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-4 sm:mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-5 sm:p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 sm:p-4 ${contact.bgColor} rounded-lg border ${contact.borderColor}`}
                    >
                      <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${contact.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase">
                        {contact.title}
                      </p>
                       {isEditMode ? (
                        <input
                          type="text"
                          name={contact.name}
                          value={contact.value}
                          onChange={handleInputChange}
                          className={`text-lg sm:text-xl font-semibold ${contact.color} mt-2 text-balance leading-relaxed break-words bg-transparent border-b-2 border-slate-300 focus:outline-none focus:border-cyan-500 w-full`}
                        />
                      ) : (
                      <p
                        className={`text-lg sm:text-xl font-semibold ${contact.color} mt-2 text-balance leading-relaxed break-words`}
                      >
                        {contact.value}
                      </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {isEditMode && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveChanges}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Patient History Section - Mobile-First Table Design */}
        <section className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Appointment History
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">Total {appointmentHistory.length} Appointments</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {appointmentHistory.length === 0 ? (
              <p className="p-4 text-center text-slate-600">No history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 text-base font-semibold text-slate-700">
                        Date
                      </th>
                      <th className="text-left p-4 text-base font-semibold text-slate-700">
                        Clinic ID
                      </th>
                      <th className="text-left p-4 text-base font-semibold text-slate-700">
                        Doctor ID
                      </th>
                      <th className="text-left p-4 text-base font-semibold text-slate-700">
                        Type
                      </th>
                      <th className="text-left p-4 text-base font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentHistory?.map((record, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            <span className="text-base font-medium text-slate-700">
                              {useDate(record.date)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-medium text-slate-800">
                            {record.clinicId._id}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-medium text-slate-800">
                            {record.doctorId._id}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-medium text-slate-700">
                            {record.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientProfile;
