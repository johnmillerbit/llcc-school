import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface Teacher {
  id: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'username',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials): Promise<Teacher | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const teacher = await prisma.teacher.findFirst({
            where: {
              username: credentials.username,
            },
          });

          if (!teacher?.password) {
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, teacher.password);

          if (teacher && isPasswordValid) {
            return {
              id: String(teacher.id),
              username: teacher.username,
            };
          }

          throw new Error('Invalid email or password');
        } catch (error) {
          console.error(error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.username = token.username;
      }
      return session;
    },
  },
};
