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
  const { studentData, teacher } = await req.json();

  try {
    if (!studentData.firstname || !studentData.lastname || !studentData.stdClass || !studentData.semester || !studentData.birthdate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (
      typeof studentData.firstname !== 'string' ||
      typeof studentData.lastname !== 'string' ||
      typeof studentData.stdClass !== 'string' ||
      typeof studentData.semester !== 'string' ||
      typeof studentData.birthdate !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    const parsedbirthdate = new Date(studentData.birthdate);
    const today = new Date();
    if (parsedbirthdate > today) {
      return NextResponse.json({ error: 'birthdate cannot be in the future' }, { status: 400 });
    }
    if (isNaN(parsedbirthdate.getTime())) {
      return NextResponse.json({ error: 'Invalid birthdate format' }, { status: 400 });
    }

    const studentId = await generateStudentId(studentData.stdClass, studentData.semester);

    const student = await prisma.student.create({
      data: {
        id: studentId,
        firstname: studentData.firstname,
        lastname: studentData.lastname,
        class: studentData.stdClass,
        semester: studentData.semester,
        birthdate: parsedbirthdate,
      },
    });

    await prisma.eventLog.create({
      data: {
        status: 'ADD_STUDENT',
        student_id: student.id,
        do_by: Number(teacher),
        update_at: new Date(),
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
