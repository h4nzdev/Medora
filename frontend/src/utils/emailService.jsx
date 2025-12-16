// utils/emailService.js
import emailjs from "@emailjs/browser";

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_50vrouu",
  APPROVAL_TEMPLATE_ID: "template_evtsibo",
  REJECTION_TEMPLATE_ID: "template_evtsibo",
  CONSULTATION_TEMPLATE_ID: "template_evtsibo", // Use same template or create a new one
  PUBLIC_KEY: "MnJJTRsFLVayVbcMf",
};

// Initialize EmailJS
export const initializeEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  console.log("EmailJS initialized!");
};

// Send appointment approval email
export const sendApprovalEmail = async (
  patientEmail,
  patientName,
  appointmentDetails
) => {
  const templateParams = {
    to_email: patientEmail,
    patient_name: patientName,
    appointment_date: appointmentDetails.date,
    appointment_time: appointmentDetails.time,
    doctor_name: appointmentDetails.doctorName,
    clinic_name: appointmentDetails.clinicName,
  };

  try {
    const res = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.APPROVAL_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return res;
  } catch (err) {
    console.error("Approval email error:", err);
    throw new Error("Failed to send approval email");
  }
};

// Send appointment rejection email
export const sendRejectionEmail = async (
  patientEmail,
  patientName,
  appointmentDetails
) => {
  const templateParams = {
    to_email: patientEmail,
    patient_name: patientName,
    appointment_date: appointmentDetails.date,
    appointment_time: appointmentDetails.time,
    doctor_name: appointmentDetails.doctorName,
    clinic_name: appointmentDetails.clinicName,
    rejection_reason:
      appointmentDetails.rejectionReason || "No reason provided",
  };

  try {
    const res = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.REJECTION_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return res;
  } catch (err) {
    console.error("Rejection email error:", err);
    throw new Error("Failed to send rejection email");
  }
};

// Send consultation link email using EmailJS
export const sendConsultationLinkEmail = async (
  email,
  patientName,
  appointmentDetails,
  consultationLink
) => {
  const templateParams = {
    to_email: email,
    patient_name: patientName,
    appointment_date: appointmentDetails.date,
    appointment_time: appointmentDetails.time,
    doctor_name: appointmentDetails.doctorName,
    clinic_name: appointmentDetails.clinicName,
    consultation_link: consultationLink, // Include the consultation link
  };

  try {
    const res = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONSULTATION_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return res;
  } catch (err) {
    console.error("Consultation link email error:", err);
    throw new Error("Failed to send consultation link email");
  }
};
