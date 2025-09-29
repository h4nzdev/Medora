import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/invoices`; // Your backend's URL

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await axios.post(`${API_URL}/`, invoiceData);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

// Get a single invoice by its ID
export const getInvoiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with id ${id}:`, error);
    throw error;
  }
};

// Get all invoices for a specific clinic
export const getInvoicesByClinic = async (clinicId) => {
  try {
    const response = await axios.get(`${API_URL}/clinic/${clinicId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoices for clinic ${clinicId}:`, error);
    throw error;
  }
};

// Update an existing invoice
export const updateInvoice = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating invoice with id ${id}:`, error);
    throw error;
  }
};

// Delete an invoice
export const deleteInvoice = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting invoice with id ${id}:`, error);
    throw error;
  }
};
