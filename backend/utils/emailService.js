import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const sendVerificationEmail = async (to, code) => {
  try {
    // Create transporter using your email credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add these specific options
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      tls: {
        // Allow connections from Render's IPs
        rejectUnauthorized: false,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Medora" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Your Email Verification Code",
      text: `Your verification code is ${code}`,
      html: `<b>Your verification code is ${code}</b>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${to} with code ${code}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};

export default sendVerificationEmail;
