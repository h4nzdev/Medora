import express from "express";
import {
  createInvoice,
  getInvoiceById,
  getInvoicesByClinic,
  updateInvoice,
  deleteInvoice,
  getInvoicesByPatient,
  getAllInvoices,
} from "../controller/invoiceController.js";

const invoiceRouter = express.Router();

// Create a new invoice
invoiceRouter.post("/", createInvoice);

// Create a new invoice
invoiceRouter.get("/", getAllInvoices);

// Get a single invoice by ID
invoiceRouter.get("/:id", getInvoiceById);

// Get all invoices for a specific clinic
invoiceRouter.get("/clinic/:clinicId", getInvoicesByClinic);

//Get all invoices for specific patient
invoiceRouter.get("/patient/:patientId", getInvoicesByPatient);

// Update an invoice
invoiceRouter.put("/:id", updateInvoice);

// Delete an invoice
invoiceRouter.delete("/:id", deleteInvoice);

export default invoiceRouter;
