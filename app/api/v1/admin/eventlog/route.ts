import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const eventLog = await prisma.eventLog.findMany({
      select: {
        id: true,
        status: true,
        old_value: true,
        new_value: true,
        update_at: true,
        teacher: {
          select: {
            username: true,
          },
        },
        student: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        term: true,
      },
      orderBy: {
        id: 'desc'
      }
    });
    return NextResponse.json({ eventLog }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Cannot get event log' }, { status: 400 });
  }
}
