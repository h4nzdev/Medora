import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppointmentContext } from "../../../context/AppointmentContext";
import { AuthContext } from "../../../context/AuthContext";
import { PatientsContext } from "../../../context/PatientsContext";
import { DoctorContext } from "../../../context/DoctorContext";
import { getInvoicesByClinic } from "../../../services/invoiceService";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-200">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {change && (
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp
              className={`w-4 h-4 mr-1 ${
                change > 0 ? "text-green-500" : "text-red-500"
              }`}
            />
            <span className={change > 0 ? "text-green-600" : "text-red-600"}>
              {change > 0 ? "+" : ""}
              {change}% from last month
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function DashboardCharts() {
  const { appointments } = useContext(AppointmentContext);
  const { patients } = useContext(PatientsContext);
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [debugInfo, setDebugInfo] = useState(""); // For debugging

  const clinicAppointments = appointments?.filter(
    (appointment) => appointment.clinicId?._id === user._id
  );

  const clinicPatients = patients?.filter(
    (patient) => patient.clinicId?._id === user._id
  );

  const clinicDoctors = doctors?.filter(
    (doctor) => doctor.clinicId?._id === user._id
  );

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

  // DEBUG: Log appointment data to see what's available
  useEffect(() => {
    if (clinicAppointments && clinicAppointments.length > 0) {
      console.log("All clinic appointments:", clinicAppointments);
      console.log("First appointment sample:", clinicAppointments[0]);

      // Check status values
      const statuses = clinicAppointments.map((apt) => apt.status);
      console.log("All status values:", statuses);

      const uniqueStatuses = [...new Set(statuses)];
      console.log("Unique status values:", uniqueStatuses);

      // Set debug info
      setDebugInfo(
        `Appointments: ${
          clinicAppointments.length
        }, Statuses: ${uniqueStatuses.join(", ")}`
      );
    }
  }, [clinicAppointments]);

  // Process appointment data by month
  const getAppointmentsByMonth = () => {
    const monthCounts = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    clinicAppointments?.forEach((appointment) => {
      const date = new Date(appointment.date);
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];

      if (!monthCounts[monthName]) {
        monthCounts[monthName] = 0;
      }
      monthCounts[monthName]++;
    });

    return months.map((month) => ({
      name: month,
      appointments: monthCounts[month] || 0,
    }));
  };

  // FIXED: Process appointment status data - more flexible status handling
  const getStatusData = () => {
    const statusCounts = {
      confirmed: 0,
      pending: 0,
      canceled: 0,
      completed: 0, // Added common status
      scheduled: 0, // Added common status
      other: 0, // Catch-all for unexpected statuses
    };

    console.log("Processing appointments for status chart...");

    clinicAppointments?.forEach((appointment) => {
      const status = appointment.status?.toLowerCase().trim();
      console.log(`Appointment status: "${status}"`);

      if (status === "confirmed" || status === "confirm") {
        statusCounts.confirmed++;
      } else if (status === "pending" || status === "pend") {
        statusCounts.pending++;
      } else if (
        status === "canceled" ||
        status === "cancelled" ||
        status === "cancel"
      ) {
        statusCounts.canceled++;
      } else if (status === "completed" || status === "complete") {
        statusCounts.completed++;
      } else if (status === "scheduled" || status === "schedule") {
        statusCounts.scheduled++;
      } else {
        statusCounts.other++;
        console.log(`Unknown status: "${status}"`);
      }
    });

    console.log("Final status counts:", statusCounts);

    // Return only statuses that have values
    const result = [
      { name: "Confirmed", value: statusCounts.confirmed },
      { name: "Pending", value: statusCounts.pending },
      { name: "Canceled", value: statusCounts.canceled },
      { name: "Completed", value: statusCounts.completed },
      { name: "Scheduled", value: statusCounts.scheduled },
      { name: "Other", value: statusCounts.other },
    ].filter((item) => item.value > 0); // Only include statuses with counts > 0

    console.log("Pie chart data:", result);
    return result;
  };

  // Process patient growth data
  const getPatientGrowth = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = {};

    clinicPatients?.forEach((patient) => {
      const date = new Date(patient.createdAt || Date.now());
      const monthIndex = date.getMonth();
      const monthName = months[monthIndex];

      if (!monthlyData[monthName]) {
        monthlyData[monthName] = 0;
      }
      monthlyData[monthName]++;
    });

    let cumulativeTotal = 0;
    return months.map((month) => {
      const newPatients = monthlyData[month] || 0;
      cumulativeTotal += newPatients;
      return {
        name: month,
        newPatients: newPatients,
        totalPatients: cumulativeTotal,
      };
    });
  };

  const appointmentData = getAppointmentsByMonth();
  const statusData = getStatusData();
  const patientData = getPatientGrowth();

  const totalAppointments = clinicAppointments?.length || 0;
  const totalPatients = clinicPatients?.length || 0;
  const totalRevenue =
    invoices?.reduce(
      (sum, invoice) => sum + parseFloat(invoice.totalAmount || 0),
      0
    ) || 0;

  const avgAppointments =
    appointmentData.length > 0
      ? Math.round(
          appointmentData.reduce((sum, item) => sum + item.appointments, 0) /
            appointmentData.filter((d) => d.appointments > 0).length
        )
      : 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Total Appointments"
          value={totalAppointments.toLocaleString()}
          change={12}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Total Patients"
          value={totalPatients}
          change={8}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={15}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Appointment Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="appointments"
                fill="url(#colorBar)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Appointment Status
          </h2>

          {/* Show message if no data */}
          {statusData.length === 0 ? (
            <div className="h-300 flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-500 mb-2">
                  No appointment status data available
                </p>
                <p className="text-sm text-slate-400">
                  {totalAppointments === 0
                    ? "No appointments found"
                    : "Check console for status debugging info"}
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:col-span-2 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Patient Growth Statistics
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={patientData}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="newPatients"
                stroke="#10b981"
                strokeWidth={3}
                name="New Patients"
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
                fill="url(#colorNew)"
              />
              <Line
                type="monotone"
                dataKey="totalPatients"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total Patients"
                dot={{ fill: "#3b82f6", r: 5 }}
                activeDot={{ r: 7 }}
                fill="url(#colorTotal)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
