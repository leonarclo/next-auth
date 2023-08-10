import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextResponse) {
  try {
    prisma.$connect;
    const body = await request.json();
    const { newPassword } = body.data;
    const token = body.token;
    const userToken = await prisma.verificationToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!userToken) {
      return new NextResponse("Invalid token!", { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: {
        id: userToken.identifier,
      },
      data: {
        hashedPassword: hashedPass,
      },
    });
    await prisma.verificationToken.update({
      where: {
        token: token,
      },
      data: {
        token: undefined,
        expires: undefined,
      },
    });
    prisma.user.upsert;
    return new NextResponse(`Password update successfully!`);
  } catch (error: any) {
    return new NextResponse(`Error: ${error}`, { status: 500 });
  }
}
