import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    prisma.$connect;
    const body = await request.json();
    const token = body.token;
    const userToken = await prisma.verificationToken.findUnique({
      where: {
        token: token,
      },
    });

    if (!userToken) {
      return new NextResponse("Invalid token!", { status: 400 });
    }
    console.log(userToken);
    await prisma.user.update({
      where: {
        id: userToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    });
    await prisma.verificationToken.delete({
      where: {
        token: token,
      },
    });
    prisma.user.upsert;
    return new NextResponse(`Password update successfully!`);
  } catch (error: any) {
    return new NextResponse(`Error: ${error}`, { status: 500 });
  }
}
