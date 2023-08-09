import nodemailer from "nodemailer";

export async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email enviado");
  } catch (error) {
    console.log(error, "email not sent");
  }
}
