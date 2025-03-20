import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const cache = new Map();

export async function GET() {
  const prisma = new PrismaClient();
  try {
    let students = cache.get('student');
    if (!students) {
      students = await prisma.student.findMany();
      cache.set('student', students);
    }
    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
