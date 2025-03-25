import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface Score {
  subject_id: number;
  term: number;
  value: number;
}

interface StudentData {
  id: string;
  firstname: string;
  lastname: string;
  class: string;
  semester: string;
  birthdate: string;
  scores: Score[];
}

interface UpdateLog {
  status: string;
  old_value: string;
  new_value: string;
  score_id?: number;
}

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { data, teacher }: { data: StudentData; teacher: number } = await req.json();

    // First, fetch the existing student details
    const existingStudent = await prisma.student.findUnique({
      where: { id: data.id },
      select: {
        firstname: true,
        lastname: true,
        class: true,
        semester: true,
        birthdate: true,
      },
    });

    // Prepare student update logs
    const studentUpdateLogs: UpdateLog[] = [];

    // Check if student details need to be updated
    const studentNeedsUpdate =
      existingStudent &&
      (existingStudent.firstname !== data.firstname ||
        existingStudent.lastname !== data.lastname ||
        existingStudent.class !== data.class ||
        existingStudent.semester !== data.semester ||
        existingStudent.birthdate.toISOString().split('T')[0] !== new Date(data.birthdate).toISOString().split('T')[0]);

    // Update student details only if there are changes
    if (studentNeedsUpdate) {
      // Prepare logs for each changed field
      if (existingStudent.firstname !== data.firstname) {
        studentUpdateLogs.push({
          status: 'UPDATE_FIRSTNAME',
          old_value: existingStudent.firstname,
          new_value: data.firstname,
        });
      }
      if (existingStudent.lastname !== data.lastname) {
        studentUpdateLogs.push({
          status: 'UPDATE_LASTNAME',
          old_value: existingStudent.lastname,
          new_value: data.lastname,
        });
      }
      if (existingStudent.class !== data.class) {
        studentUpdateLogs.push({
          status: 'UPDATE_CLASS',
          old_value: existingStudent.class,
          new_value: data.class,
        });
      }
      if (existingStudent.semester !== data.semester) {
        studentUpdateLogs.push({
          status: 'UPDATE_SEMESTER',
          old_value: existingStudent.semester,
          new_value: data.semester,
        });
      }
      if (existingStudent.birthdate.toISOString().split('T')[0] !== new Date(data.birthdate).toISOString().split('T')[0]) {
        studentUpdateLogs.push({
          status: 'UPDATE_BIRTHDATE',
          old_value: existingStudent.birthdate.toISOString().split('T')[0],
          new_value: new Date(data.birthdate).toISOString().split('T')[0],
        });
      }

      // Perform student update
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
    }

    // Fetch existing scores for this student to compare
    const existingScores = await prisma.score.findMany({
      where: {
        student_id: data.id,
        OR: data.scores.map(score => ({
          subject_id: score.subject_id,
          term: score.term,
        })),
      },
      select: {
        id: true,
        subject_id: true,
        term: true,
        value: true,
      },
    });

    // Prepare score update logs and upsert operations
    const scoreUpdateLogs: UpdateLog[] = [];
    const upsertPromises = data.scores
      .filter((score: Score) => {
        const existingScore = existingScores.find(existing => existing.subject_id === score.subject_id && existing.term === score.term);

        // Only update if the score doesn't exist or has a different value
        return !existingScore || existingScore.value !== score.value;
      })
      .map((score: Score) => {
        const existingScore = existingScores.find(existing => existing.subject_id === score.subject_id && existing.term === score.term);

        // If existing score found and value is different, prepare log
        if (existingScore && existingScore.value !== score.value) {
          scoreUpdateLogs.push({
            status: 'UPDATE_SCORE',
            old_value: String(existingScore.value),
            new_value: String(score.value),
            score_id: existingScore.id,
          });
        }

        // Upsert operation
        return prisma.score.upsert({
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
        });
      });

    // Combine and execute all operations
    const operations = [
      // Log student updates
      ...studentUpdateLogs.map(log =>
        prisma.eventLog.create({
          data: {
            status: log.status,
            old_value: String(log.old_value),
            new_value: String(log.new_value),
            do_by: Number(teacher),
            update_at: new Date(),
          },
        })
      ),
      // Log score updates
      ...scoreUpdateLogs.map(update =>
        prisma.eventLog.create({
          data: {
            status: update.status,
            old_value: update.old_value ?? null,
            new_value: update.new_value ?? null,
            score_id: update.score_id ?? null,
            do_by: Number(teacher),
            update_at: new Date(),
          },
        })
      ),
      // Execute score upserts
      ...(upsertPromises.length > 0 ? upsertPromises : []),
    ];

    // Execute all operations
    await Promise.all(operations);

    return NextResponse.json({
      message: 'Student updated successfully',
      studentUpdated: studentNeedsUpdate,
      updatedScores: upsertPromises.length,
      studentUpdateLogs: studentUpdateLogs.length,
      scoreUpdateLogs: scoreUpdateLogs.length,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
