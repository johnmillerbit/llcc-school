import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cache = new Map()

export async function PUT(req: NextRequest) {
  try {
    const { std_id, term, reading, speaking, grammar, wordCombination, tense, listening, translation } = await req.json();

    if (!std_id) {
      throw new Error('Student id is required');
    }
    if (!term) {
      throw new Error('Term id is required');
    }

    // Map of subject IDs to their respective score values
    const scoreUpdates = [
      { subjectId: 3, value: parseFloat(reading) },
      { subjectId: 4, value: parseFloat(wordCombination) },
      { subjectId: 5, value: parseFloat(speaking) },
      { subjectId: 6, value: parseFloat(listening) },
      { subjectId: 7, value: parseFloat(grammar) },
      { subjectId: 8, value: parseFloat(tense) },
      { subjectId: 9, value: parseFloat(translation) },
    ];

    // Process all score updates
    for (const { subjectId, value } of scoreUpdates) {
      if (value !== undefined && !isNaN(value)) {
        // Add NaN check
        await prisma.score.upsert({
          where: {
            student_id_subject_id_term: {
              student_id: std_id,
              subject_id: subjectId,
              term: term,
            },
          },
          update: {
            value: value,
          },
          create: {
            student_id: std_id,
            subject_id: subjectId,
            term: term,
            value: value,
          },
        });
      }
    }
    cache.delete("score")

    return new Response(JSON.stringify({ message: 'Scores updated successfully' }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to update scores' }), {
      status: 500,
    });
  }
}
