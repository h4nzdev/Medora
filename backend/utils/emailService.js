import brevo from '@getbrevo/brevo';

const sendVerificationEmail = async (to, code) => {
  try {
    const defaultClient = brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new brevo.TransactionalEmailsApi();
    
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Medora - Your Email Verification Code";
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
    sendSmtpEmail.sender = { name: "Medora", email: "noreply@medora.com" };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log(`✅ Email sent to ${to} with code ${code}`);
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send verification email" };
  }
};

export default sendVerificationEmail;