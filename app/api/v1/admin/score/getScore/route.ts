import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const cache = new Map();

export async function GET() {
  try {
    let score = cache.get('score');
    if (!score) {
      score = await prisma.score.findMany();
      cache.set('score', score);
    }
    return NextResponse.json({ score }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ err }, { status: 500 });
  }
}
