import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  try {
    prisma.$connect();
    const body = await request.json();
    const { email, password } = body.data;
    console.log(body.data);

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !user.hashedPassword) {
      return new NextResponse("User not found!", { status: 400 });
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    console.log(passwordMatches);

    if (!passwordMatches) {
      return new NextResponse("Incorrect password!", { status: 400 });
    }

    const tokenUserSession = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(tokenUserSession, process.env.SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    console.log("errouuuuu", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
