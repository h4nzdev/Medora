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
import { toast } from "react-toastify";

const ClientProfile = () => {
  const { user, initials, setUser } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      // Create a safe copy of user data for editing
      setUpdatedUser({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });

      const fetchAppointmentHistory = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/appointment/patient/${user._id}`
          );
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
    setError(""); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]:
        name === "age" ? (value === "" ? "" : parseInt(value) || 0) : value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!updatedUser) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/patient/${user._id}`,
        updatedUser
      );

      // Ensure we have the updated patient data
      if (response.data && response.data.patient) {
        // Merge the updated data with existing user data to preserve clinic info
        const mergedUser = {
          ...user, // Keep existing data including clinicId
          ...response.data.patient, // Override with updated fields
        };

        setUser(mergedUser);
        setIsEditMode(false);
        toast.success(response.data.message);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original user data
    setUpdatedUser({
      name: user.name || "",
      age: user.age || "",
      gender: user.gender || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });
    setIsEditMode(false);
    setError("");
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-slate-50">
        <div className="mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-slate-200/50">
            <p className="text-slate-600 text-lg">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Add error display
  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 shadow-lg p-6 max-w-md">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold mb-2">Error</p>
            <p>{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Full Name",
      value: updatedUser?.name || "",
      icon: User,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      name: "name",
    },
    {
      title: "Age",
      value: `${updatedUser?.age || ""} years`,
      icon: Calendar,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      name: "age",
    },
    {
      title: "Gender",
      value: updatedUser?.gender || "",
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      name: "gender",
    },
    {
      title: "Role",
      value: user.role || "",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      name: "role",
      isEditable: false,
    },
  ];

  const contactInfo = [
    {
      title: "Email Address",
      value: updatedUser?.email || "",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      name: "email",
    },
    {
      title: "Phone Number",
      value: updatedUser?.phone || "",
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      name: "phone",
    },
    {
      title: "Address",
      value: updatedUser?.address || "",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      name: "address",
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
        {/* Header Section */}
        <header className="mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cyan-700 flex items-center justify-center shadow-lg overflow-hidden">
                {user.patientPicture ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${user.patientPicture.replace(/\\/g, '/')}`}
                    alt="Patient Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
                    {initials}
                  </span>
                )}
              </div>

              {/* User Info */}
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
                  {user.name}
                </h1>
                <p className="text-slate-600 mt-3 text-xl font-medium break-all leading-relaxed">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                  <span className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg text-base font-semibold tracking-wide uppercase border border-cyan-200">
                    {user.role}
                  </span>
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg text-base font-semibold tracking-wide border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              {/* Registration Info */}
              <div className="text-center sm:text-right mt-4 sm:mt-0">
                <p className="text-base font-medium text-slate-600 tracking-wide uppercase">
                  Registered Date
                </p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {useDate(user.createdAt)}
                </p>
                <p className="text-base font-medium text-slate-600 tracking-wide uppercase mt-3">
                  Patient ID
                </p>
                <p className="text-lg font-bold text-cyan-700 break-all">
                  {user._id}
                </p>
                <button
                  onClick={isEditMode ? handleCancelEdit : handleEditClick}
                  disabled={isLoading}
                  className="mt-4 flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 transition-colors px-4 py-2 rounded-lg text-base disabled:opacity-50"
                >
                  <Edit className="w-5 h-5" />
                  <span>{isEditMode ? "Cancel" : "Edit Profile"}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Personal Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} backdrop-blur-sm rounded-xl p-4 sm:p-6 border ${stat.borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex flex-col flex-row items-center justify-between space-x-3">
                    <div
                      className={`p-3 ${stat.bgColor} rounded-lg border ${stat.borderColor} self-start self-center`}
                    >
                      <IconComponent
                        className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase">
                        {stat.title}
                      </p>
                      {isEditMode && stat.isEditable !== false ? (
                        <input
                          type={stat.name === "age" ? "number" : "text"}
                          name={stat.name}
                          value={stat.value.replace(" years", "")}
                          onChange={handleInputChange}
                          className={`text-xl sm:text-2xl font-bold ${stat.color} mt-2 capitalize leading-tight bg-white/70 border-2 border-slate-300 focus:outline-none focus:border-cyan-500 w-full rounded px-3 py-2`}
                          disabled={isLoading}
                        />
                      ) : (
                        <p
                          className={`text-xl sm:text-2xl font-bold ${stat.color} mt-2 capitalize leading-tight`}
                        >
                          {stat.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-6">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-4 sm:p-6 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div
                      className={`p-3 sm:p-4 ${contact.bgColor} rounded-lg border ${contact.borderColor} self-start`}
                    >
                      <IconComponent
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${contact.color}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-slate-600 tracking-wide uppercase">
                        {contact.title}
                      </p>
                      {isEditMode ? (
                        <textarea
                          name={contact.name}
                          value={contact.value}
                          onChange={handleInputChange}
                          rows="2"
                          className={`text-lg sm:text-xl font-semibold ${contact.color} mt-2 leading-relaxed bg-white/70 border-2 border-slate-300 focus:outline-none focus:border-cyan-500 w-full rounded px-3 py-2 resize-none`}
                          disabled={isLoading}
                        />
                      ) : (
                        <p
                          className={`text-lg sm:text-xl font-semibold ${contact.color} mt-2 leading-relaxed break-words`}
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
          <div className="flex justify-center sm:justify-end mt-6 mb-8 gap-4">
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors text-lg font-medium disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Rest of your component remains the same */}
        <section className="mb-8">
          <div className="flex flex-col space-y-2 mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Appointment History
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Total {appointmentHistory.length} Appointments
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {appointmentHistory.length === 0 ? (
              <p className="p-6 text-center text-slate-600 text-base sm:text-lg">
                No appointment history yet.
              </p>
            ) : (
              <>
                {/* Mobile Card Layout */}
                <div className="block lg:hidden">
                  {appointmentHistory?.map((record, index) => (
                    <div
                      key={index}
                      className="p-4 border-b border-slate-100 last:border-b-0"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            <span className="text-base font-semibold text-slate-700">
                              {useDate(record.date)}
                            </span>
                          </div>
                          <span
                            className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-slate-500 uppercase font-medium">
                              Type
                            </p>
                            <p className="text-base font-semibold text-slate-700">
                              {record.type}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <p className="text-sm text-slate-500 uppercase font-medium">
                                Clinic ID
                              </p>
                              <p className="text-sm font-medium text-slate-800 break-all">
                                {record.clinicId._id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 uppercase font-medium">
                                Doctor ID
                              </p>
                              <p className="text-sm font-medium text-slate-800 break-all">
                                {record.doctorId._id}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden lg:block overflow-x-auto">
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
                            <span className="text-base font-medium text-slate-800 break-all">
                              {record.clinicId._id}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-base font-medium text-slate-800 break-all">
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
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientProfile;
