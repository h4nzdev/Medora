import Invoice from "../model/invoiceModel.js";
import Clinic from "../model/clinicModel.js";
import Patient from "../model/patientsModel.js";
import Appointment from "../model/appointmentModel.js";
import Doctor from "../model/doctorModel.js"; // Added since we now have doctorId

// Helper function to generate invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(
    3,
    "0"
  )}`;
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const {
      clinicId,
      patientId,
      appointmentId,
      doctorId,
      services,
      totalAmount,
      paidAmount,
      dueDate,
      status,
      description,
      date,
    } = req.body;

    // Basic validation
    if (
      !clinicId ||
      !patientId ||
      !appointmentId ||
      !doctorId ||
      !services ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if clinic, patient, doctor, and appointment exist
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    // Auto-generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    const newInvoice = new Invoice({
      invoiceNumber,
      clinicId,
      patientId,
      doctorId,
      appointmentId,
      services,
      totalAmount,
      paidAmount: paidAmount || 0,
      dueDate,
      status,
      description,
      date: date || Date.now(),
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
      .populate("patientId", "name email phone")
      .populate("doctorId", "name email")
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
      .populate("patientId", "name email phone")
      .populate("doctorId", "name email")
      .populate("appointmentId", "date time");

    if (!invoices || invoices.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoices found for this clinic" });
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
    const {
      services,
      totalAmount,
      paidAmount,
      status,
      dueDate,
      description,
      doctorId,
      date,
    } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      {
        services,
        totalAmount,
        paidAmount,
        status,
        dueDate,
        description,
        doctorId,
        date,
      },
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

// Get all invoices for a specific patient
export const getInvoicesByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const invoices = await Invoice.find({ patientId })
      .populate("clinicId", "clinicName")
      .populate("doctorId", "name email")
      .populate("appointmentId", "date time");

    if (!invoices || invoices.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoices found for this patient" });
    }

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoices for patient",
      error: error.message,
    });
  }
};
