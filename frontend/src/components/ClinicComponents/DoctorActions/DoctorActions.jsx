import { useState, useContext } from "react";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { DoctorContext } from "../../../context/DoctorContext";

const DoctorActions = ({ id, doctor, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { fetchDoctors } = useContext(DoctorContext);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/doctor/${id}`);
      toast.success("Doctor deleted successfully!");
      fetchDoctors(); // Refresh the doctors list
    } catch (error) {
      toast.error("Failed to delete doctor.");
      console.error("Error deleting doctor:", error);
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors duration-200"
        aria-label="More"
        onClick={handleToggle}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-slate-200 overflow-hidden">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100"
          >
            <Edit className="h-4 w-4 text-cyan-600" />
            <span>Edit Doctor</span>
          </button>

          <button
            onClick={() => navigate(`/clinic/doctor-profile/${id}`)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100"
          >
            <Eye className="h-4 w-4 text-blue-600" />
            <span>View Profile</span>
          </button>

          <button
            onClick={confirmDelete}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            <span>Delete Doctor</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorActions;
