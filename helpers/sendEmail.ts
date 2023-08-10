import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export const EmailType = {
  verify: "verify",
  reset: "reset",
};

export type SendEmailType = {
  email: string;
  emailType: string;
  userId: string;
};

const prisma = new PrismaClient();

export async function sendEmail({ email, emailType, userId }: SendEmailType) {
  try {
    const hashedToken = await bcrypt.hash(userId, 10);
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (user) {
      await prisma.verificationToken.create({
        data: {
          identifier: user.id,
          token: hashedToken,
          expires: new Date(new Date().getTime() + 3600000),
        },
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject:
        emailType === EmailType.verify
          ? "Verify your email ✔"
          : "Reset your password 🔑",
      html: `<p><a href="${process.env.BASE_URL}/${
        emailType === EmailType.verify ? "verifyEmail" : "password/reset"
      }?token=${hashedToken}">Click here</a> to ${
        emailType === EmailType.verify
          ? "Verify your email"
          : "Reset your password"
      }</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("Email not sent:", error);
  }
}
