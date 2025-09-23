
import nodemailer from 'nodemailer';

const sendVerificationEmail = async (to, code) => {
  try {
    // For this simulation, we are not sending a real email.
    // Instead, we are logging the action to the console.
    // In a production environment, you would configure a real email transport here.
    console.log(`Simulating email sent to ${to} with code ${code}`);

    // Create a transporter object using a test service like Ethereal or Mailtrap,
    // or a real one like Gmail, etc.
    // In a real app, these credentials should be in environment variables.
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // Using a fake SMTP server for testing
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'account.user', // generated ethereal user
        pass: 'account.pass', // generated ethereal password
      },
    });

    // Email content
    const mailOptions = {
      from: '"Medora" <noreply@medora.com>',
      to: to,
      subject: 'Your Email Verification Code',
      text: `Your verification code is ${code}`,
      html: `<b>Your verification code is ${code}</b>`,
    };

    // In a real implementation, you would uncomment the next line.
    // await transporter.sendMail(mailOptions);

    return { success: true, message: 'Email sent successfully (simulated)' };

  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
};

export default sendVerificationEmail;
