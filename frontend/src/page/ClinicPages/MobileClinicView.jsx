import {
  Calendar,
  Users,
  UserCheck,
  Plus,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  Bell,
  Activity,
  DollarSign,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../context/AppointmentContext";
import { AuthContext } from "../../context/AuthContext";
import { PatientsContext } from "../../context/PatientsContext";
import { DoctorContext } from "../../context/DoctorContext";
import { getStatusBadge, getStatusIcon } from "../../utils/appointmentStats";
import { useDate, useTime } from "../../utils/date";
import DashboardCharts from "./ClinicDashboard/DashboardCharts";
import { getInvoicesByClinic } from "../../services/invoiceService";
import { Link } from "react-router-dom";
import { useTourGuide } from "../../hooks/useTourGuide";
import SubscriptionPopup from "../../components/ClinicComponents/SubscriptionPopup";
import { useSubscriptionPopup } from "../../hooks/useSubscriptionPopup";
import { respondToAppointment } from "../../services/appointmentService";
import MobileHeader from "./MobileComponents/MobileHeader";
import MobileAppointment from "./MobileComponents/MobileAppointment";
import MobilePendingAppointment from "./MobileComponents/MobilePendingAppointment";
import MobileActions from "./MobileComponents/MobileActions";

const MobileClinicView = () => {
  const { appointments, updateAppointmentStatus } =
    useContext(AppointmentContext);
  const { patients } = useContext(PatientsContext);
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);
  const [showAll, setShowAll] = useState(false);
  const [view, setView] = useState("default");
  const [invoices, setInvoices] = useState([]);
  const [showTour, setShowTour] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [processingAppointments, setProcessingAppointments] = useState({});
  const [processingAction, setProcessingAction] = useState(null);

  const { isPopupOpen, popupFeature, popupRequiredPlan, showPopup, hidePopup } =
    useSubscriptionPopup();

  const handleChartsClick = () => {
    if (user.subscriptionPlan !== "pro") {
      showPopup("Advanced Analytics & Charts", "pro");
    } else {
      setView("charts");
    }
  };

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem("clinicDashboardVisited");
    if (!hasVisited) {
      setShowTour(true);
      localStorage.setItem("clinicDashboardVisited", "true");
    }
  }, []);

  useTourGuide(showTour);

  const clinicAppointments = appointments?.filter(
    (appointment) => appointment.clinicId?._id === user._id
  );

  const clinicPatients = patients?.filter(
    (patient) => patient.clinicId?._id === user._id
  );

  const clinicDoctors = doctors?.filter(
    (doctor) => doctor.clinicId?._id === user._id
  );

  const visibleAppointments = showAll
    ? clinicAppointments
    : clinicAppointments?.slice(0, 3);

  const getAppointmentLimit = () => {
    if (user?.subscriptionPlan === "free") {
      return 10;
    } else if (user?.subscriptionPlan === "basic") {
      return 20;
    }
    return "Unlimited";
  };

  const fetchInvoices = async () => {
    if (user?._id) {
      try {
        const data = await getInvoicesByClinic(user._id);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchInvoices();
    }
  }, [user]);

  const totalAmount = invoices?.reduce(
    (sum, invoice) => sum + parseFloat(invoice.totalAmount || 0),
    0
  );
  const appointmentLimit = getAppointmentLimit();

  // Handle appointment response (approve/reject)
  const handleAppointmentResponse = async (appointmentId, action) => {
    try {
      setProcessingAppointments((prev) => ({
        ...prev,
        [appointmentId]: action,
      }));
      setProcessingAction(`${action}-${appointmentId}`);

      // Call the API to update appointment status
      const response = await respondToAppointment(appointmentId, action);

      if (response.success) {
        // Update local state through context
        if (updateAppointmentStatus) {
          updateAppointmentStatus(
            appointmentId,
            action === "approve" ? "confirmed" : "cancelled"
          );
        }

        // Show success message
        alert(
          `Appointment ${
            action === "approve" ? "approved" : "rejected"
          } successfully!`
        );
      } else {
        alert(
          `Failed to ${action} appointment: ${
            response.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      alert(`Error ${action}ing appointment. Please try again.`);
    } finally {
      setProcessingAppointments((prev) => {
        const newState = { ...prev };
        delete newState[appointmentId];
        return newState;
      });
      setProcessingAction(null);
    }
  };

  // Static data for demonstration
  const stats = {
    appointments: clinicAppointments?.length,
    patients: clinicPatients?.length,
    doctors: clinicDoctors?.length,
    revenue: totalAmount,
  };

  const recentActivities = [
    {
      id: 1,
      action: "New patient registered",
      time: "2 minutes ago",
      type: "patient",
    },
    {
      id: 2,
      action: "Appointment confirmed",
      time: "15 minutes ago",
      type: "appointment",
    },
    { id: 3, action: "Payment received", time: "1 hour ago", type: "payment" },
    {
      id: 4,
      action: "Doctor added to system",
      time: "3 hours ago",
      type: "doctor",
    },
  ];

  // Bottom navigation tabs
  const tabs = [
    { id: "home", label: "Home", icon: Sparkles, component: "stats" },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      component: "appointments",
    },
    {
      id: "pending",
      label: "Pending",
      icon: Clock,
      component: "pending",
    },
    {
      id: "actions",
      label: "Actions",
      icon: Activity,
      component: "actions",
    },
  ];

  if (view === "charts") {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <DashboardCharts />
        <button
          onClick={() => setView("default")}
          className="fixed bottom-20 left-4 bg-cyan-600 text-white p-3 rounded-full shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <>
            {/* Stats Cards - Mobile Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Appointments Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Appointments
                    </p>
                    <p className="text-xl font-semibold text-cyan-600">
                      {stats.appointments}
                      {appointmentLimit !== "Unlimited" && (
                        <span className="text-xs font-medium text-gray-500 ml-1">
                          / {appointmentLimit}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </p>
                  </div>
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-cyan-600" />
                  </div>
                </div>
              </div>

              {/* Patients Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Patients
                    </p>
                    <p className="text-xl font-semibold text-sky-600">
                      {stats.patients}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +5
                    </p>
                  </div>
                  <div className="bg-sky-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </div>

              {/* Doctors Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Doctors</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {stats.doctors}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">All active</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Revenue</p>
                    <p className="text-xl font-semibold text-emerald-600">
                      ₱{stats?.revenue}
                    </p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </p>
                  </div>
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Recent Activity
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "patient"
                            ? "bg-cyan-500"
                            : activity.type === "appointment"
                            ? "bg-sky-500"
                            : activity.type === "payment"
                            ? "bg-emerald-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "appointments":
        return (
          <MobileAppointment
            showAll={showAll}
            setShowAll={setShowAll}
            visibleAppointments={visibleAppointments}
          />
        );

      case "pending":
        return (
          <MobilePendingAppointment
            clinicAppointments={clinicAppointments}
            showAll={showAll}
            setShowAll={setShowAll}
            handleAppointmentResponse={handleAppointmentResponse}
            processingAppointments={processingAppointments}
          />
        );

      case "actions":
        return <MobileActions />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Mobile Header */}
      <MobileHeader
        activeTab={activeTab}
        handleChartsClick={handleChartsClick}
        user={user}
      />

      {/* Main Content */}
      <div className="p-4">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1 px-2 ${
              activeTab === tab.id ? "text-cyan-600" : "text-gray-500"
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-xs font-medium mt-1">{tab.label}</span>
          </button>
        ))}
      </div>

      <SubscriptionPopup
        isOpen={isPopupOpen}
        onClose={hidePopup}
        featureName={popupFeature}
        requiredPlan={popupRequiredPlan}
        currentPlan={user.subscriptionPlan}
      />
    </div>
  );
};

export default MobileClinicView;
