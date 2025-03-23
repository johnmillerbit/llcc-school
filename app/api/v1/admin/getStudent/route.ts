import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const students = await prisma.student.findMany();

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
