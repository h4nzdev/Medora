// actionFunctions.js
import Swal from "sweetalert2";
import { toast } from "sonner";
import { deleteAppointment } from "../../../../services/appointmentService";

export const handleDelete = async (id, setIsLoading, setIsOpen) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await deleteAppointment(id);
        toast.success("Appointment deleted successfully!");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while deleting!");
      } finally {
        setIsLoading(false);
        setIsOpen(false);
      }
    }
  });
};
