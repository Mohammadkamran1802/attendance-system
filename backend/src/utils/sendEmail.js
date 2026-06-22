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

  // Support EMAIL_PASS copied with spaces (Gmail app passwords are sometimes shown with spaces)
  const emailPass = process.env.EMAIL_PASS.replace(/\s+/g, "");

  try {
    // Use Gmail SMTP. For accounts with 2FA, create an App Password and set it as EMAIL_PASS.
    const createTransport = (opts) =>
      nodemailer.createTransport({
        host: "smtp.gmail.com",
        ...opts,
        auth: {
          user: process.env.EMAIL_USER,
          pass: emailPass,
        },
      });

    // primary: port 465 (secure)
    let transporter = createTransport({ port: 465, secure: true });

    // verify SMTP connection early to give clearer errors; if it fails, try port 587 as a fallback
    try {
      await transporter.verify();
      console.log("SMTP transporter verified (465)");
    } catch (err465) {
      console.warn("SMTP verify on 465 failed, trying 587 as fallback:", err465?.message || err465);

      // try port 587 (STARTTLS)
      transporter = createTransport({
        port: 587,
        secure: false,
        tls: { rejectUnauthorized: false },
      });

      // await transporter.verify();
      console.log("SMTP transporter verified (587)");
    }

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