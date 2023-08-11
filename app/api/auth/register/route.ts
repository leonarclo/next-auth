import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { EmailType, sendEmail } from "@/helpers/sendEmail";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    prisma.$connect;
    const body = await request.json();
    const { name, email, password } = body.data;
    console.log(body.data);

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email or password", {
        status: 400,
      });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) return new NextResponse("User already exists", { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });
    prisma.user.upsert;

    const userId = user.id;
    await sendEmail({ email, emailType: EmailType.verify, userId });

    return new NextResponse("User Created successfully", { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
