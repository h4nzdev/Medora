import { useContext, useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Shield,
  CheckCircle,
  Clock,
  FileText,
  X,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { formatDate } from "../../../utils/date";
import axios from "axios";
import { toast } from "sonner";

const ClientProfile = () => {
  const { user, initials, setUser } = useContext(AuthContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [viewPicture, setViewPicture] = useState(false);

  useEffect(() => {
    if (user) {
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
    setError("");
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

      if (response.data && response.data.patient) {
        const mergedUser = {
          ...user,
          ...response.data.patient,
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <p className="text-slate-600 text-lg">No user data available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "text-cyan-600 bg-cyan-50";
      case "completed":
        return "text-emerald-600 bg-emerald-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-5">
      {viewPicture && (
        <div
          onClick={() => setViewPicture(false)}
          className="fixed flex inset-0 bg-black/50 w-full h-full justify-center items-center z-50 top-0 p-4"
        >
          <X className="absolute top-5 right-5 text-white" size={34} />
          <img src={user.patientPicture} className="lg:h-200" />
        </div>
      )}
      <div>
        {/* Header - Clean and Minimal */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 mb-6 shadow-sm border border-slate-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div
                onClick={() => setViewPicture(true)}
                className="w-20 h-20 cursor-pointer rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md"
              >
                {user.patientPicture ? (
                  <img
                    src={user.patientPicture}
                    alt={user.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {initials}
                  </span>
                )}
              </div>
              <div className="text-left">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                  {user.name}
                </h1>
                <p className="text-slate-600 mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {user.role}
                  </span>
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="text-slate-700 font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <button
                onClick={isEditMode ? handleCancelEdit : handleEditClick}
                disabled={isLoading}
                className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
              >
                <Edit className="w-4 h-4" />
                <span className="font-medium">
                  {isEditMode ? "Cancel" : "Edit"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Personal Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-2">
                      Full Name
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedUser?.name || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-slate-800 p-3 bg-slate-50 rounded-lg">
                        {user.name}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-2">
                      Age
                    </label>
                    {isEditMode ? (
                      <input
                        type="number"
                        name="age"
                        value={updatedUser?.age || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-slate-800 p-3 bg-slate-50 rounded-lg">
                        {user.age} years
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-2">
                      Gender
                    </label>
                    {isEditMode ? (
                      <select
                        name="gender"
                        value={updatedUser?.gender || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        disabled={isLoading}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p className="text-slate-800 p-3 bg-slate-50 rounded-lg capitalize">
                        {user.gender}
                      </p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-2">
                      Role
                    </label>
                    <p className="text-slate-800 p-3 bg-slate-50 rounded-lg">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">
                    Email Address
                  </label>
                  {isEditMode ? (
                    <input
                      type="email"
                      name="email"
                      value={updatedUser?.email || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-slate-800 p-3 bg-slate-50 rounded-lg break-words">
                      {user.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">
                    Phone Number
                  </label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={updatedUser?.phone || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-slate-800 p-3 bg-slate-50 rounded-lg">
                      {user.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">
                    Address
                  </label>
                  {isEditMode ? (
                    <textarea
                      name="address"
                      value={updatedUser?.address || ""}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      disabled={isLoading}
                    />
                  ) : (
                    <p className="text-slate-800 p-3 bg-slate-50 rounded-lg">
                      {user.address || "No address provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            {isEditMode && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-6 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className="px-6 py-3 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}

            {/* Appointment History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-cyan-600" />
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Appointment History
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    {appointmentHistory.length} total appointments
                  </p>
                </div>
              </div>

              {appointmentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No appointment history yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointmentHistory.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-800">
                              {formatDate(record.date)}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {record.type} • {record.clinicId._id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Clean and Minimal */}
          <div className="space-y-6">
            {/* Patient ID */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-800">Patient ID</h3>
              </div>
              <p className="text-sm text-slate-600 font-mono bg-slate-50 p-3 rounded-lg break-all">
                {user._id}
              </p>
            </div>

            {/* Account Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-800">
                  Account Overview
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">Status</span>
                  <span className="text-emerald-600 font-medium text-sm">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 text-sm">Member Since</span>
                  <span className="text-slate-800 font-medium text-sm">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600 text-sm">
                    Total Appointments
                  </span>
                  <span className="text-slate-800 font-medium text-sm">
                    {appointmentHistory.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Medical Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100 text-sm">Upcoming</span>
                  <span className="font-semibold">
                    {
                      appointmentHistory.filter((a) => a.status === "scheduled")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100 text-sm">Completed</span>
                  <span className="font-semibold">
                    {
                      appointmentHistory.filter((a) => a.status === "completed")
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-100 text-sm">This Month</span>
                  <span className="font-semibold">
                    {
                      appointmentHistory.filter(
                        (a) =>
                          new Date(a.date).getMonth() === new Date().getMonth()
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
