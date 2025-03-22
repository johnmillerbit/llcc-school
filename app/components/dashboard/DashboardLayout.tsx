'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@heroui/react';
import DashboardSidebar from '@/app/components/dashboard/DashboardSidebar';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <DashboardHeader 
          username={session?.user?.username || ''} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <main className="p-6">
          <Card className="p-6">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}