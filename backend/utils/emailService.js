import brevo from "@getbrevo/brevo";

const sendVerificationEmail = async (to, code) => {
  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    // ✅ Use Brevo's default sender (no verification needed)
    sendSmtpEmail.sender = { name: "Medora", email: "hanzhmagbal@gmail.com" };
    // OR use the onboarding email:
    // sendSmtpEmail.sender = { name: "Medora", email: "onboarding@brevo.com" };

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = "Medora - Your Verification Code";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Medora - Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; font-size: 24px;">
          ${code}
        </h1>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent to ${to} with code ${code}`);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("❌ Brevo API error:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};

export default sendVerificationEmail;
