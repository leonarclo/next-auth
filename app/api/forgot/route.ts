import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/sendEmail";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body.data;
  console.log(body.data);

  try {
    await prisma.$connect;
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return new NextResponse("User doesn't exists!", { status: 442 });
    }

    let token = await prisma.verificationToken.findFirst({
      where: { identifier: user.id },
    });

    const now = new Date();
    if (!token) {
      token = await prisma.verificationToken.create({
        data: {
          identifier: user.id,
          token: await bcrypt.hash(user.id, 10),
          expires: new Date(now.getTime() + 3600000),
        },
      });
      return token;
    }

    const link = `${process.env.BASE_URL}/recovery/?identifier=${user.id}&token=${token.token}`;

    await sendEmail(
      user.email,
      "Password reset",
      `<div>
        <h1>Follow the following link</h1>
          <p>Please follow <a href="${link}"> this link </a> to reset your password
        </p>
      </div>`
    );
    return new NextResponse("password reset link sent to your email account", {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(`Error: ${error}`, { status: 200 });
  }
}
