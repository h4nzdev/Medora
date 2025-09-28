import Invoice from "../model/invoiceModel.js";
import Clinic from "../model/clinicModel.js";
import Patient from "../model/patientsModel.js";
import Appointment from "../model/appointmentModel.js";

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const { clinicId, patientId, appointmentId, services, totalAmount, dueDate, status } = req.body;

    // Basic validation
    if (!clinicId || !patientId || !appointmentId || !services || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if clinic, patient, and appointment exist
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const newInvoice = new Invoice({
      clinicId,
      patientId,
      appointmentId,
      services,
      totalAmount,
      dueDate,
      status
    });

    await newInvoice.save();
    req.io.emit("invoice_updated"); // Notify clients

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating invoice", error: error.message });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("clinicId", "clinicName")
      .populate("patientId", "name email")
      .populate("appointmentId", "date time");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoice", error: error.message });
  }
};

// Get all invoices for a specific clinic
export const getInvoicesByClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const invoices = await Invoice.find({ clinicId })
      .populate("patientId", "name email")
      .populate("appointmentId", "date time");

    if (!invoices) {
      return res.status(404).json({ message: "No invoices found for this clinic" });
    }

    res.status(200).json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching invoices", error: error.message });
  }
};


// Update an invoice
export const updateInvoice = async (req, res) => {
  try {
    const { services, totalAmount, status, dueDate } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { services, totalAmount, status, dueDate },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    req.io.emit("invoice_updated");

    res.status(200).json({
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating invoice", error: error.message });
  }
};

// Delete an invoice
export const deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    req.io.emit("invoice_updated");

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting invoice", error: error.message });
  }
};
