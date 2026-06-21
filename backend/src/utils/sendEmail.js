import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  // Validate inputs
  if (!to || !subject || !text) {
    throw new Error("Missing required email parameters: to, subject, text");
  }

  // Check environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
  }

  try {
    // Use Gmail SMTP. For accounts with 2FA, create an App Password and set it as EMAIL_PASS.
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // verify SMTP connection early to give clearer errors
    await transporter.verify();
    console.log("SMTP transporter verified");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM
        ? `"Standard Interior" <${process.env.EMAIL_FROM}>`
        : `"Standard Interior" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent successfully", { messageId: info.messageId });
    return info;
  } catch (error) {
    console.error("Email sending failed:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
      to,
    });
    throw error;
  }
};

export default sendEmail;