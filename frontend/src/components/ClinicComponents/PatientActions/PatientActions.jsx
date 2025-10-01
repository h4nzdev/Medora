import { useState } from "react";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientActions = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
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
              setIsOpen(false);
            }}
            className="block flex items-center gap-2 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="block flex items-center gap-2 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-start"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <button
            onClick={() => navigate(`/clinic/patient-profile/${id}`)}
            className="block flex items-center gap-2 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-start"
          >
            <Eye size={14} />
            View
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientActions;
