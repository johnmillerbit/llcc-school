'use client';
import { Form, Input, Button, Card } from '@heroui/react';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const { data: session, status } = useSession()
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (!result?.ok) {
        console.error('Login failed', result?.error);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.username === 'llccxmiller') {
        router.push('/admin/dashboard');
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            label="Username"
            placeholder="Enter your username"
            isRequired
            onChange={e => setUsername(e.target.value)}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            isRequired
            onChange={e => setPassword(e.target.value)}
            className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
            Login
          </Button>
        </Form>
        <Button onPress={() => signOut()}>Log out</Button>
      </Card>
    </div>
  );
}
