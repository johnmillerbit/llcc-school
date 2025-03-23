import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function generateStudentId(classId: string, semester: string): Promise<string> {
  const year = semester.split('-')[0].slice(-2);

  const lastStudent = await prisma.student.findFirst({
    where: {
      class: classId,
      semester,
    },
    orderBy: {
      sequence: 'desc',
    },
  });

  const sequence = (lastStudent?.sequence ?? 0) + 1;
  const paddedSequence = sequence.toString().padStart(2, '0');

  return `${year}${classId}${paddedSequence}`;
}

export async function POST(req: NextRequest) {
  const { firstname, lastname, stdClass, semester, birthdate } = await req.json();

  try {
    if (!firstname || !lastname || !stdClass || !semester || !birthdate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (typeof firstname !== 'string' || typeof lastname !== 'string' || typeof stdClass !== 'string' || typeof semester !== 'string' || typeof birthdate !== 'string') {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    const parsedbirthdate = new Date(birthdate);
    const today = new Date();
    if (parsedbirthdate > today) {
      return NextResponse.json({ error: 'birthdate cannot be in the future' }, { status: 400 });
    }
    if (isNaN(parsedbirthdate.getTime())) {
      return NextResponse.json({ error: 'Invalid birthdate format' }, { status: 400 });
    }

    const studentId = await generateStudentId(stdClass, semester);

    const student = await prisma.student.create({
      data: {
        id: studentId,
        firstname,
        lastname,
        class: stdClass,
        semester,
        birthdate: parsedbirthdate,
      },
    });

    return NextResponse.json(
      {
        message: 'Student created successfully',
        student,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
