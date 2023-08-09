import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function PATCH(request: Request, { params }: any) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const passwordResetToken = searchParams.get("token");

  try {
    prisma.$connect;

    const user = await prisma.user.findUnique(params.identifier);

    if (!user) {
      return new NextResponse("Invalid user!", { status: 400 });
    }

    const token = await prisma.verificationToken.findFirst({
      where: { identifier: user.id, token: passwordResetToken },
    });

    if (!token) {
      return new NextResponse("Invalid Link or expired", { status: 400 });
    }

    user.hashedPassword = await bcrypt.hash(body.password, 10);
    await prisma.user.update;
    await prisma.verificationToken.delete({
      where: { token: passwordResetToken },
    });

    alert("Password reset successfully");
    return new NextResponse("Password reset successfully");
  } catch (error: any) {
    return new NextResponse(`Error: ${error}`, { status: 500 });
  }
}
