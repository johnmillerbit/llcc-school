'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@heroui/react';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`${isSidebarOpen ? 'ml-36' : 'ml-0'} transition-all duration-300`}>
        <DashboardHeader username={session?.user?.username || ''} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-6">
          <Card className="p-6">
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  style: {
                    background: '#4CAF50',
                    color: 'white',
                  },
                },
                error: {
                  style: {
                    background: '#F44336',
                    color: 'white',
                  },
                },
              }}
            />
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
