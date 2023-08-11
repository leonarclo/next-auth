import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { EmailType, sendEmail } from "@/helpers/sendEmail";

const prisma = new PrismaClient();

export async function POST(request: NextResponse) {
  try {
    prisma.$connect;
    const body = await request.json();
    const { email } = body.data;
    console.log(body.data);
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      return new NextResponse("User doesn't exists!", { status: 442 });
    }

    const userId = user.id;
    await sendEmail({ email, emailType: EmailType.reset, userId });

    return new NextResponse("Forget password email sent!", { status: 400 });
  } catch (error: any) {
    return new NextResponse(`Error: ${error}`, { status: 500 });
  }
}
