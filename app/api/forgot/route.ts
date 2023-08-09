import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

export default async function POST(req: any, res: any) {
  if (req.method === "POST") {
    const { email } = await req.body.data;

    try {
      const user = await prisma.user.findUnique({ where: { email: email } });

      if (!user) {
        return new NextResponse("User doesn't exists!", { status: 442 });
      } else {
        const token = await prisma.verificationToken.findFirst({
          where: {
            identifier: user.id,
          },
        });

        if (token) {
          await prisma.verificationToken.delete({
            where: {
              token: token.token,
            },
          });
        }

        const securedTokenId = nanoid(32);

        await prisma.verificationToken.create({
          data: {
            identifier: user.id,
            token: securedTokenId,
            expires: new Date(),
          },
        });

        const link = `${process.env.HOST_URL}/forgot/${securedTokenId}`;

        const email = process.env.EMAIL;
        const pass = process.env.EMAIL_PASS;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: email,
            pass,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "Reset Password",
          text: "Reset Password Message",
          html: `
          <div>
             <h1>Follow the following link</h1>
              <p>Please follow 
                <a href="${link}"> this link </a> 
                to reset your password
                </p>
          </div>
          `,
        });
      }
    } catch (error: any) {
      return new NextResponse(`Error: ${error}`, { status: 200 });
    }
    return new NextResponse("Success!", { status: 200 });
  } else if (req.method === "PUT") {
    const { tokenId, password } = await req.body.data;

    try {
      const token = await prisma.verificationToken.findFirst({
        where: { token: tokenId },
      });

      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired password reset token",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: token.identifier },
      });

      const hashedPassword = await await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { id: user?.id },
        data: { hashedPassword: hashedPassword },
      });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password reset successfully",
        html: "Password has been successfully reset",
      });

      await prisma.verificationToken.delete({
        where: { token: token.token },
      });

      res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error: any) {
      return res.status(400).send({ message: error.message });
    }
  } else {
    res.status(400).json({ success: false, message: "Bad request" });
  }
}
