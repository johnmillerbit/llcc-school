import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cache = new Map();

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    await prisma.student.delete({
      where: {
        id,
      },
    });
    // cache.delete('students');
    new Promise((resolve, reject) => {
      try {
        resolve(cache.delete('students'));
      } catch (error) {
        reject('error' + error);
      }
    });
    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
