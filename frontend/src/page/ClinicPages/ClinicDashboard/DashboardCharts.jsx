import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const appointmentData = [
  { name: 'Jan', appointments: 120 },
  { name: 'Feb', appointments: 150 },
  { name: 'Mar', appointments: 170 },
  { name: 'Apr', appointments: 210 },
  { name: 'May', appointments: 180 },
  { name: 'Jun', appointments: 250 },
];

const statusData = [
  { name: 'Confirmed', value: 400 },
  { name: 'Pending', value: 150 },
  { name: 'Canceled', value: 50 },
];

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8">Appointment Trends</h2>
        <BarChart width={600} height={300} data={appointmentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#8884d8" />
        </BarChart>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8">Appointment Status</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={statusData}
            cx={200}
            cy={150}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
