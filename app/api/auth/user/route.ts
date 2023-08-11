import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  token: string;
}

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return new NextRequest("Acess token not found!");
    }
    const decodedToken = jwt.verify(token, process.env.SECRET!) as JwtPayload;
    console.log(decodedToken);
    const userId = decodedToken.id;
    console.log("user id:", userId);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    return NextResponse.json({
      message: "User data found successfully",
      success: true,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        token: token,
      },
    });
  } catch (error: any) {
    console.log("errouuuuu", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
