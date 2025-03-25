import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface Score {
  subject_id: number;
  term: number;
  value: number;
}

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    // Update student details (this part remains unchanged)
    await prisma.student.update({
      where: { id: data.id },
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        class: data.class,
        semester: data.semester,
        birthdate: new Date(data.birthdate),
      },
    });

    // Prepare all upsert operations as an array of promises
    const upsertPromises = data.scores.map((score: Score) =>
      prisma.score.upsert({
        where: {
          student_id_subject_id_term: {
            student_id: data.id,
            subject_id: score.subject_id,
            term: score.term,
          },
        },
        update: {
          value: score.value,
        },
        create: {
          student_id: data.id,
          subject_id: score.subject_id,
          term: score.term,
          value: score.value,
        },
      })
    );

    // Execute all upserts concurrently
    await Promise.all(upsertPromises);

    return NextResponse.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
