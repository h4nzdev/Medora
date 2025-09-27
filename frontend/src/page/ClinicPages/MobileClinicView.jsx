import React, { useState, useContext } from 'react';
import {
  Home,
  Calendar,
  Users,
  Clock,
  UserCheck,
  MessageCircle,
  Search,
  Bell,
  Phone,
  Video,
  Send,
  Activity,
  TrendingUp,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { AppointmentContext } from '../../context/AppointmentContext';
import { PatientsContext } from '../../context/PatientsContext';
import { DoctorContext } from '../../context/DoctorContext';
import { AuthContext } from '../../context/AuthContext';

const MedoraApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chatInput, setChatInput] = useState('');

  const { appointments } = useContext(AppointmentContext);
  const { patients } = useContext(PatientsContext);
  const { doctors } = useContext(DoctorContext);
  const { user } = useContext(AuthContext);

  const clinicAppointments = appointments?.filter(
    (appointment) => appointment.clinicId?._id === user._id
  );

  const clinicPatients = patients?.filter(
    (patient) => patient.clinicId?._id === user._id
  );

  const clinicDoctors = doctors?.filter(
    (doctor) => doctor.clinicId?._id === user._id
  );

  const pendingAppointments = clinicAppointments?.filter(apt => apt.status === 'pending');

  const chatHistory = [
    { id: 1, type: 'ai', message: 'Hello! I\'m your AI medical assistant. How can I help you today?', time: '10:30 AM' },
    { id: 2, type: 'user', message: 'What are the symptoms of high blood pressure?', time: '10:32 AM' },
    { id: 3, type: 'ai', message: 'High blood pressure often has no symptoms, which is why it\'s called the "silent killer." However, some people may experience headaches, shortness of breath, or nosebleeds when blood pressure is severely high.', time: '10:32 AM' },
    { id: 4, type: 'user', message: 'What should I monitor?', time: '10:35 AM' },
    { id: 5, type: 'ai', message: 'Regular monitoring includes: blood pressure readings, weight, salt intake, and physical activity levels. I recommend checking with your healthcare provider for personalized guidance.', time: '10:35 AM' },
  ];

  const ModernStatCard = ({ icon: Icon, title, value, subtitle, trend, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-5 shadow-sm border-0 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl ${color} bg-opacity-20`}>
            <Icon size={20} className={color.replace('bg-', 'text-')} />
          </div>
          {trend && <TrendingUp size={16} className="text-green-500" />}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white bg-opacity-10 -mr-10 -mt-10"></div>
    </div>
  );

  const ModernAppointmentCard = ({ appointment, showActions = false }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-semibold text-sm">{appointment.patientId?.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{appointment.patientId?.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-600 text-sm">{appointment.type}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-cyan-600 font-medium text-sm">{new Date(appointment.date).toLocaleTimeString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {appointment.status}
          </span>
          {showActions && appointment.status === 'pending' && (
            <div className="flex space-x-1">
              <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                Approve
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                Decline
              </button>
            </div>
          )}
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );

  const ModernPatientCard = ({ patient }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            patient.severity === 'high' ? 'bg-red-500' :
            patient.severity === 'moderate' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-gray-600 text-sm">Age {patient.age}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-cyan-600 text-sm font-medium">{patient.condition}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">Last visit: {patient.lastVisit}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Eye size={16} className="text-gray-400" />
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );

  const ModernDoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserCheck size={24} className="text-white" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            doctor.status === 'Available' ? 'bg-green-500' :
            doctor.status === 'In Session' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-gray-600 text-sm">{doctor.specialty}</p>
          <div className="flex items-center space-x-3 mt-1">
            <span className="text-gray-500 text-xs">{doctor.patients} patients</span>
            <span className="text-yellow-500 text-xs">⭐ {doctor.rating}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            doctor.status === 'Available' ? 'bg-green-100 text-green-700' :
            doctor.status === 'In Session' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {doctor.status}
          </span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ModernStatCard
                icon={Calendar}
                title="Today's Appointments"
                value={clinicAppointments?.length || 0}
                subtitle="+3 from yesterday"
                trend={true}
                color="bg-cyan-500"
                bgColor="bg-gradient-to-br from-cyan-50 to-cyan-100"
              />
              <ModernStatCard
                icon={Users}
                title="Active Patients"
                value={clinicPatients?.length || 0}
                subtitle="86 new this month"
                color="bg-blue-500"
                bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
              />
              <ModernStatCard
                icon={Clock}
                title="Pending Approvals"
                value={pendingAppointments?.length || 0}
                subtitle="Requires attention"
                color="bg-yellow-500"
                bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
              />
              <ModernStatCard
                icon={Activity}
                title="Active Doctors"
                value={clinicDoctors?.length || 0}
                subtitle="2 on break"
                color="bg-green-500"
                bgColor="bg-gradient-to-br from-green-50 to-green-100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                <span className="text-sm text-cyan-600 font-medium">View all</span>
              </div>
              <div className="space-y-3">
                {clinicAppointments?.slice(0, 3).map(appointment => (
                  <ModernAppointmentCard key={appointment._id} appointment={appointment} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
                <span className="text-sm text-cyan-600 font-medium">View all</span>
              </div>
              <div className="space-y-3">
                {clinicPatients?.slice(0, 2).map(patient => (
                  <ModernPatientCard key={patient._id} patient={patient} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                  <Calendar size={20} className="text-gray-600" />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium whitespace-nowrap">All</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Today</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Upcoming</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Completed</button>
            </div>

            <div className="space-y-3">
              {clinicAppointments?.map(appointment => (
                <ModernAppointmentCard key={appointment._id} appointment={appointment} />
              ))}
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
              <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                <Users size={20} className="text-gray-600" />
              </div>
            </div>

            <div className="relative">
              <Search size={20} className="absolute left-4 top-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or condition..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent shadow-sm"
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium whitespace-nowrap">All Patients</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">High Risk</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Recent</button>
            </div>

            <div className="space-y-3">
              {clinicPatients?.map(patient => (
                <ModernPatientCard key={patient._id} patient={patient} />
              ))}
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingAppointments?.length} pending
              </div>
            </div>

            {pendingAppointments?.length > 0 ? (
              <div className="space-y-3">
                {pendingAppointments?.map(appointment => (
                  <ModernAppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    showActions={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending appointments to review</p>
              </div>
            )}
          </div>
        );

      case 'doctors':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Medical Staff</h2>
              <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
                <UserCheck size={20} className="text-gray-600" />
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium whitespace-nowrap">All Staff</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Available</button>
              <button className="bg-white text-gray-600 px-4 py-2 rounded-xl font-medium border border-gray-200 whitespace-nowrap">Busy</button>
            </div>

            <div className="space-y-3">
              {clinicDoctors?.map(doctor => (
                <ModernDoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
                <p className="text-gray-600 text-sm">Medical support & information</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <Phone size={18} className="text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                  <Video size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {chatHistory.map(chat => (
                  <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs ${chat.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        chat.type === 'user'
                          ? 'bg-cyan-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{chat.message}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">{chat.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about symptoms, treatments, or medical info..."
                    className="flex-1 px-4 py-3 bg-white rounded-2xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button className="bg-cyan-500 text-white p-3 rounded-2xl hover:bg-cyan-600 transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'appointments', icon: Calendar, label: 'Schedule' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'pending', icon: Clock, label: 'Pending' },
    { id: 'doctors', icon: UserCheck, label: 'Staff' },
    { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Medora
              </h1>
              <p className="text-gray-600 text-sm mt-1">Healthcare Management Platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">3</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">Dr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderContent()}
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} className={isActive ? 'mb-1' : ''} />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'opacity-100 mt-1' : 'opacity-0 absolute'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MedoraApp;
