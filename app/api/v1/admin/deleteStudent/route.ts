import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const { id, teacher } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    const student = await prisma.student.delete({
      where: {
        id,
      },
    });
    await prisma.eventLog.create({
      data: {
        status: 'DELETE_STUDENT',
        new_value: `${student.firstname} ${student.lastname}`,
        do_by: Number(teacher),
        update_at: new Date(),
      },
    });
    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
