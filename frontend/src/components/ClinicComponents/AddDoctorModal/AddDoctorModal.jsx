import { useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { DoctorContext } from "../../../context/DoctorContext";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDoctorModal = ({
  isOpen,
  onClose,
  editMode = false,
  doctorData = null,
}) => {
  const { user } = useContext(AuthContext);
  const { fetchDoctors } = useContext(DoctorContext);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    qualification: "",
    specialty: "",
    experience: "",
    email: "",
    phone: "",
    status: "Active",
    availability: [
      {
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
      },
    ],
  });

  // Update form data when doctorData changes (for editing)
  useEffect(() => {
    if (editMode && doctorData) {
      setFormData({
        name: doctorData.name || "",
        gender: doctorData.gender || "",
        qualification: doctorData.qualification || "",
        specialty: doctorData.specialty || "",
        experience: doctorData.experience || "",
        email: doctorData.email || "",
        phone: doctorData.phone || "",
        status: doctorData.status || "Active",
        availability: doctorData.availability || [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
          },
        ],
      });
    } else {
      // Reset form when adding new doctor
      setFormData({
        name: "",
        gender: "",
        qualification: "",
        specialty: "",
        experience: "",
        email: "",
        phone: "",
        status: "Active",
        availability: [
          {
            day: "Monday",
            startTime: "09:00",
            endTime: "17:00",
          },
        ],
      });
    }
  }, [editMode, doctorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && doctorData) {
        // Update existing doctor
        await axios.put(
          `${import.meta.env.VITE_API_URL}/doctor/${doctorData._id}`,
          {
            ...formData,
            clinicId: user._id,
          }
        );
        toast.success("Doctor updated successfully!");
      } else {
        // Add new doctor
        await axios.post(`${import.meta.env.VITE_API_URL}/doctor/add-doctor`, {
          ...formData,
          clinicId: user._id,
        });
        toast.success("Doctor added successfully!");
      }
      fetchDoctors();
      onClose();
    } catch (error) {
      if (editMode) {
        toast.error("Error updating doctor");
      } else {
        toast.error("Error adding doctor");
      }
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {editMode ? "Edit Doctor" : "Add New Doctor"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Qualification */}
              <div>
                <label
                  htmlFor="qualification"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Qualification
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. MD, DDS"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Specialty (Dropdown) */}
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Specialty</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Surgeon">Surgeon</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Availability section stays as is */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Availability
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      availability: [
                        ...prev.availability,
                        { day: "Monday", startTime: "09:00", endTime: "17:00" },
                      ],
                    }));
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                >
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-4">
                {formData.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day
                      </label>
                      <select
                        value={slot.day}
                        onChange={(e) => {
                          const newAvailability = [...formData.availability];
                          newAvailability[index] = {
                            ...slot,
                            day: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            availability: newAvailability,
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newAvailability = [...formData.availability];
                          newAvailability[index] = {
                            ...slot,
                            startTime: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            availability: newAvailability,
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newAvailability = [...formData.availability];
                          newAvailability[index] = {
                            ...slot,
                            endTime: e.target.value,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            availability: newAvailability,
                          }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.availability.length <= 1) return;
                          setFormData((prev) => ({
                            ...prev,
                            availability: prev.availability.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                        disabled={formData.availability.length <= 1}
                        className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editMode ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDoctorModal;
