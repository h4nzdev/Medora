import React from "react";
import { Eye } from "lucide-react";

const ClientMedicalRecordsTableBody = () => {
  const records = [
    {
      date: "2024-08-25",
      doctor: "Dr. Sarah Wilson",
      reason: "Follow-up Consultation",
    },
    {
      date: "2024-07-12",
      doctor: "Dr. Michael Brown",
      reason: "Annual Check-up",
    },
  ];

  return (
    <tbody>
      {records.map((record, index) => (
        <tr
          key={index}
          className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <td className="py-4 px-4 text-slate-700">{record.date}</td>
          <td className="py-4 px-4 text-slate-700">{record.doctor}</td>
          <td className="py-4 px-4 text-slate-700">{record.reason}</td>
          <td className="py-4 px-4">
            <button className="flex items-center text-cyan-600 hover:text-cyan-800">
              <Eye className="w-5 h-5 mr-2" />
              View Details
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default ClientMedicalRecordsTableBody;
