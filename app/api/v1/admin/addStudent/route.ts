import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cache = new Map();

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
  cache.delete("student")

  const sequence = (lastStudent?.sequence ?? 0) + 1;
  const paddedSequence = sequence.toString().padStart(2, '0');

  return `${year}${classId}${paddedSequence}`;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const firstname = form.get('firstname');
  const lastname = form.get('lastname');
  const stdClass = form.get('stdClass');
  const semester = form.get('semester');
  const birthDate = form.get('birthDate');

  try {
    if (!firstname || !lastname || !stdClass || !semester || !birthDate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (typeof firstname !== 'string' || typeof lastname !== 'string' || typeof stdClass !== 'string' || typeof semester !== 'string' || typeof birthDate !== 'string') {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    const parsedBirthDate = new Date(birthDate);
    const today = new Date();
    if (parsedBirthDate > today) {
      return NextResponse.json({ error: 'birthDate cannot be in the future' }, { status: 400 });
    }
    if (isNaN(parsedBirthDate.getTime())) {
      return NextResponse.json({ error: 'Invalid birthDate format' }, { status: 400 });
    }

    const studentId = await generateStudentId(stdClass, semester);

    const student = await prisma.student.create({
      data: {
        id: studentId,
        firstname,
        lastname,
        class: stdClass,
        semester,
        birthdate: parsedBirthDate,
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
