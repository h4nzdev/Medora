import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import MedicalRecordDetailsSidebar from "./MedicalRecordDetailsSidebar";

const ClinicMedicalRecordsTableBody = ({
  records,
  onRecordUpdate,
  onRecordDelete,
}) => {
  const [showActions, setShowActions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleView = (record) => {
    setSelectedRecord(record);
    setIsSidebarOpen(true);
    setShowActions(null);
  };

  const handleEdit = (record) => {
    // Open edit modal or navigate to edit page
    console.log("Editing record:", record);
    toast.info("Edit feature coming soon");
    setShowActions(null);
  };

  const handleDelete = (record) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete medical record for ${record.patientId?.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call delete function
        if (onRecordDelete) {
          onRecordDelete(record._id);
        }
        toast.success("Medical record deleted successfully");
        setShowActions(null);

        // Close sidebar if the deleted record is currently open
        if (selectedRecord?._id === record._id) {
          handleCloseSidebar();
        }
      }
    });
  };

  const toggleActions = (recordId) => {
    setShowActions(showActions === recordId ? null : recordId);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedRecord(null);
  };

  // Close actions when clicking outside
  const handleClickOutside = () => {
    setShowActions(null);
  };

  return (
    <>
      <tbody onClick={handleClickOutside}>
        {records?.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center py-8 text-slate-500">
              No medical records in this clinic found.
            </td>
          </tr>
        ) : (
          records?.map((record, index) => (
            <tr
              key={record._id}
              className="hover:bg-slate-50 transition-colors border-t border-slate-200 relative"
            >
              <td className="py-4 px-4 font-mono text-slate-700">
                #{String(index + 1).padStart(4, "0")}
              </td>
              <td className="px-4 font-semibold text-slate-800">
                {record?.patientId?.name}
              </td>
              <td className="px-4">
                {new Date(record.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 max-w-xs truncate" title={record.diagnosis}>
                {record.diagnosis}
              </td>
              <td className="px-4">{record.doctorId?.name}</td>
              <td className="px-4">
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md text-sm w-fit">
                  Reviewed
                </span>
              </td>
              <td className="px-4 text-right relative">
                <button
                  type="button"
                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-md inline-flex items-center justify-center mx-auto transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActions(record._id);
                  }}
                  aria-label="Actions"
                  disabled={loading}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {/* Action Dropdown */}
                {showActions === record._id && (
                  <div className="absolute right-4 top-12 z-10 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(record);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      disabled={loading}
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                      View Details
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(record);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4 text-green-500" />
                      Edit Record
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(record);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>

      {/* Medical Record Details Sidebar */}
      <MedicalRecordDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        record={selectedRecord}
        onRecordDelete={onRecordDelete}
        onRecordUpdate={onRecordUpdate}
      />
    </>
  );
};

export default ClinicMedicalRecordsTableBody;
