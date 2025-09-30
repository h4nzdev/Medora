import { useState, useContext } from "react";
import { MoreHorizontal } from "lucide-react";
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
      await axios.delete(`http://localhost:3000/doctor/${id}`);
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
        className="p-2 hover:bg-slate-100 rounded-md text-slate-500"
        aria-label="More"
        onClick={handleToggle}
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50 px-4">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="block py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start border-b border-gray-300"
          >
            Edit
          </button>
          <button
            onClick={confirmDelete}
            className="block py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start border-b border-gray-300"
          >
            Delete
          </button>
          <button
            onClick={() => navigate(`/clinic/doctor-profile/${id}`)}
            className="block py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start border-b border-gray-300"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorActions;
