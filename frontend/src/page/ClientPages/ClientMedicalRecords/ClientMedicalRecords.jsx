import {
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  Clock,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import useMedicalRecords from "../../../hooks/medicalRecords";
import { useState } from "react";
import MedicalRecordsModal from "../../../components/ClientComponents/MedicalRecordsModal/MedicalRecordsModal";
import jsPDF from "jspdf";
import { formatDate, useTime } from "../../../utils/date";
import { deleteMedicalRecord } from "../../../services/medicalrecords_services/recordsServices";
import Swal from "sweetalert2";

const ClientMedicalRecords = () => {
  const { records } = useMedicalRecords();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const openModal = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedRecord(null);
  };

  const handleDownloadAll = (records) => {
    const doc = new jsPDF();
    let yPos = 10;

    doc.setFontSize(18);
    doc.text("Medical Records", 10, yPos);
    yPos += 10;

    records.forEach((record, index) => {
      doc.setFontSize(12);
      doc.text(`Record ${index + 1}`, 10, yPos);
      yPos += 10;

      doc.text(`Appointment ID: ${record.appointmentId?._id}`, 15, yPos);
      yPos += 5;
      doc.text(
        `Appointment Date: ${new Date(
          record.appointmentId?.date
        ).toLocaleDateString()}`,
        15,
        yPos
      );
      yPos += 5;
      doc.text(`Clinic: ${record.clinicId?.clinicName}`, 15, yPos);
      yPos += 5;
      doc.text(`Doctor: ${record.doctorId?.name}`, 15, yPos);
      yPos += 5;
      doc.text(`Diagnosis: ${record.diagnosis}`, 15, yPos);
      yPos += 5;
      doc.text(`Treatment: ${record.treatment}`, 15, yPos);
      yPos += 10;
    });

    doc.save("medical-records.pdf");
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        customClass: {
          confirmButton: "btn-confirm-custom",
          cancelButton: "btn-cancel-custom",
        },
        buttonsStyling: false,
      });

      if (result.isConfirmed) {
        await deleteMedicalRecord(id);
        console.log("Successfully deleted: ", id);
        Swal.fire("Deleted!", "Your record has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error!", "Failed to delete record.", "error");
    }
  };

  const stats = [
    {
      title: "Total Records",
      value: records.length.toString(),
      icon: FileText,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
    {
      title: "This Year",
      value: null,
      icon: Calendar,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
    },
    {
      title: "Doctors Seen",
      value: null,
      icon: User,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Last Visit",
      value: "Aug 25",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 pb-6">
      <div className="mx-auto">
        <header className="mb-8 md:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                Medical Records
              </h1>
              <p className="text-slate-600 mt-3 text-lg sm:text-xl leading-relaxed">
                Access your appointment history and medical records.
              </p>
            </div>
            <button
              onClick={() => handleDownloadAll(records)}
              className="group flex items-center justify-center px-6 md:px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-base md:text-lg font-semibold"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              Download All Records
            </button>
          </div>
        </header>

        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`${stat.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p
                        className={`${stat.color} text-xs md:text-base font-semibold uppercase tracking-wider mb-3 truncate opacity-80`}
                      >
                        {stat.title}
                      </p>
                      <p className="text-xl md:text-4xl font-bold text-slate-800 group-hover:scale-105 transition-transform duration-300">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 md:p-4 rounded-xl ${stat.bgColor} ml-3 flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 border ${stat.borderColor}`}
                    >
                      <IconComponent
                        className={`w-6 h-6 md:w-7 md:h-7 ${stat.color}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              All Medical Records
            </h2>
            <p className="text-slate-600 mt-2 text-lg">
              {records.length} medical record{records.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {records.length > 0 ? (
              records?.map((record, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex-grow">
                    <p className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-cyan-600 transition-colors duration-300">
                      {record.doctorId?.name}
                    </p>
                    <p className="text-cyan-600 font-semibold text-sm tracking-wide uppercase mt-1">
                      {formatDate(record.createdAt)}
                    </p>
                    <div className="my-4 h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
                    <p className="text-slate-700 mb-4 font-medium leading-relaxed">
                      {record.diagnosis}
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(record)}
                    className="mt-auto flex items-center justify-center p-3 bg-slate-100/80 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-slate-200 hover:shadow-md group-hover:bg-cyan-50 group-hover:text-cyan-700 transition-all duration-300 border border-slate-200/50 w-full"
                  >
                    <Eye className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold tracking-wide">
                      View Details
                    </span>
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-12 text-center">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 w-fit mx-auto mb-6">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No medical records found
                </h3>
                <p className="text-slate-500 text-lg">
                  Your medical records will appear here after appointments.
                </p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                <tr>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Doctor
                  </th>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Clinic
                  </th>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Date
                  </th>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Diagnosis
                  </th>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Treatment
                  </th>
                  <th className="py-6 px-6 font-bold text-slate-700 text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records?.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-all duration-300 border-t border-slate-200/30 group"
                    >
                      <td className="py-6 px-6">
                        <p className="font-bold text-slate-800 text-lg group-hover:text-cyan-600 transition-colors duration-300">
                          {record.doctorId?.name}
                        </p>
                        <p className="text-base text-slate-500 font-medium">
                          Appointment: #{record.appointmentId?._id?.slice(-4)}
                        </p>
                      </td>
                      <td className="px-6">
                        <p className="font-semibold text-slate-700 text-base">
                          {record.clinicId?.clinicName}
                        </p>
                      </td>
                      <td className="px-6">
                        <p className="font-semibold text-slate-700 text-base">
                          {formatDate(record.createdAt)}
                        </p>
                        <p className="text-base text-slate-500 font-medium">
                          {useTime(record.createdAt)}
                        </p>
                      </td>
                      <td className="px-6">
                        <p className="font-semibold text-slate-700 text-base leading-relaxed">
                          {record.diagnosis}
                        </p>
                      </td>
                      <td className="px-6">
                        <p className="font-semibold text-slate-700 text-base leading-relaxed">
                          {record.treatment}
                        </p>
                      </td>
                      <td className="px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(record)}
                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300 text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(record._id)}
                            className="p-2 hover:bg-red-100 rounded-xl text-slate-500 hover:text-red-700 transition-all duration-300 hover:scale-105 cursor-pointer"
                            aria-label="More options"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-16">
                      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 w-fit mx-auto mb-6">
                        <FileText className="w-20 h-20 text-slate-400 mx-auto" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-700 mb-3">
                        No medical records found
                      </h3>
                      <p className="text-slate-500 text-lg">
                        Your medical records will appear here after
                        appointments.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <MedicalRecordsModal
        isOpen={isOpen}
        setIsOpen={closeModal}
        record={selectedRecord}
      />
    </div>
  );
};

export default ClientMedicalRecords;
