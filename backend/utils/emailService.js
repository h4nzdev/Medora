import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, code) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Medora <onboarding@resend.dev>", // You can change this later
      to: to,
      subject: "Your Email Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Medora - Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px;">
            ${code}
          </h1>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Email sent to ${to} with code ${code}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};

export default sendVerificationEmail;
