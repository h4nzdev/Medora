import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const sendVerificationEmail = async (to, code) => {
  try {
    // Create transporter using your email credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
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
