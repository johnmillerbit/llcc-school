'use client';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'next-auth/react';

interface DashboardHeaderProps {
  username: string;
  toggleSidebar: () => void;
}

export default function DashboardHeader({ username, toggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            isIconOnly
            variant="light"
            onPress={toggleSidebar}
            className="mr-4"
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {username}</span>
          <Button 
            color="danger" 
            variant="light"
            onPress={() => signOut()}
            startContent={<FontAwesomeIcon icon={faSignOutAlt} />}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}