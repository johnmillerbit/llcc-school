import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function generateStudentId(classId: string, semester: string, tx: Prisma.TransactionClient): Promise<{ id: string, sequence: number }> {
  try {
    const year = semester.split('-')[0].slice(-2);
    const lastStudent = await tx.student.findFirst({
      where: { class: classId, semester },
      orderBy: { sequence: 'desc' },
    });

    const sequence = (lastStudent?.sequence ?? 0) + 1;
    const paddedSequence = sequence.toString().padStart(2, '0');
    const id = `${year}${classId}${paddedSequence}`;
    return { id, sequence };
  } catch (error) {
    throw new Error(`Failed to generate student ID: ${error}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { studentData, teacher } = await req.json();

    // Input validation
    if (!studentData?.firstname || !studentData?.lastname || !studentData?.stdClass || 
        !studentData?.semester || !studentData?.birthdate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if ([studentData.firstname, studentData.lastname, studentData.stdClass, 
         studentData.semester, studentData.birthdate].some(val => typeof val !== 'string')) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    const parsedBirthdate = new Date(studentData.birthdate);
    if (isNaN(parsedBirthdate.getTime())) {
      return NextResponse.json({ error: 'Invalid birthdate format' }, { status: 400 });
    }
    if (parsedBirthdate > new Date()) {
      return NextResponse.json({ error: 'Birthdate cannot be in the future' }, { status: 400 });
    }

    const student = await prisma.$transaction(async (tx) => {
      const { id, sequence } = await generateStudentId(studentData.stdClass, studentData.semester, tx);

      // Check if ID already exists (extra safety)
      const existingStudent = await tx.student.findUnique({ where: { id } });
      if (existingStudent) {
        throw new Error(`Student ID ${id} already exists`);
      }

      const newStudent = await tx.student.create({
        data: {
          id,
          sequence, // Store the calculated sequence
          firstname: studentData.firstname,
          lastname: studentData.lastname,
          class: studentData.stdClass,
          semester: studentData.semester,
          birthdate: parsedBirthdate,
        },
      });

      await tx.eventLog.create({
        data: {
          status: 'ADD_STUDENT',
          student_id: newStudent.id,
          do_by: Number(teacher),
          update_at: new Date(),
        },
      });

      return newStudent;
    });

    return NextResponse.json({ message: 'Student created successfully', student }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}