// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const cache = new Map();

// export async function PUT(req: NextRequest) {
//   try {
//     const { 
//       std_id, 
//       term, 
//       reading, 
//       speaking, 
//       grammar, 
//       wordCombination, 
//       tense, 
//       listening, 
//       translation 
//     } = await req.json();

//     // Input validation
//     if (!std_id) {
//       return NextResponse.json(
//         { error: 'Student ID is required' }, 
//         { status: 400 }
//       );
//     }

//     if (!term) {
//       return NextResponse.json(
//         { error: 'Term is required' }, 
//         { status: 400 }
//       );
//     }

//     // Validate term is a number
//     const termNumber = Number(term);
//     if (isNaN(termNumber)) {
//       return NextResponse.json(
//         { error: 'Term must be a number' }, 
//         { status: 400 }
//       );
//     }
//     // Map of subject IDs to their respective score values with validation
//     const scoreUpdates = [
//       { subjectId: 3, value: parseFloat(reading), name: 'Reading' },
//       { subjectId: 4, value: parseFloat(wordCombination), name: 'Word Combination' },
//       { subjectId: 5, value: parseFloat(speaking), name: 'Speaking' },
//       { subjectId: 6, value: parseFloat(listening), name: 'Listening' },
//       { subjectId: 7, value: parseFloat(grammar), name: 'Grammar' },
//       { subjectId: 8, value: parseFloat(tense), name: 'Tense' },
//       { subjectId: 9, value: parseFloat(translation), name: 'Translation' },
//     ];

//     // Validate score values
//     for (const { value, name } of scoreUpdates) {
//       if (value !== undefined && (!isNaN(value))) {
//         if (value < 0 || value > 100) {
//           return NextResponse.json(
//             { error: `${name} score must be between 0 and 100` }, 
//             { status: 400 }
//           );
//         }
//       }
//     }

//     // Process all score updates
//     const updatePromises = scoreUpdates
//       .filter(({ value }) => value !== undefined && !isNaN(value))
//       .map(async ({ subjectId, value }) => {
//         return prisma.score.upsert({
//           where: {
//             student_id_subject_id_term: {
//               student_id: std_id,
//               subject_id: subjectId,
//               term: termNumber,
//             },
//           },
//           update: {
//             value: value,
//           },
//           create: {
//             student_id: std_id,
//             subject_id: subjectId,
//             term: termNumber,
//             value: value,
//           },
//         });
//       });

//     // Execute all updates in parallel
//     await Promise.all(updatePromises);

//     // Clear cache after successful update
//     cache.delete("score");

//     return NextResponse.json(
//       { message: 'Scores updated successfully' }, 
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error('Error updating scores:', err);
//     return NextResponse.json(
//       { error: 'Failed to update scores' }, 
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
