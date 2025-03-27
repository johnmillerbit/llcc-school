'use client';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: faHome, label: 'Overview', path: '/admin/dashboard' },
    { icon: faUsers, label: 'Students', path: '/admin/dashboard/students' },
    { icon: faChartBar, label: 'Event log', path: '/admin/dashboard/eventlog' },
  ];

  return (
    <aside
      className={`
      fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300
      ${isOpen ? 'w-36' : 'w-0'}
    `}
    >
      <div className="p-4">
        <h2
          className={`
          text-xl font-bold text-center transition-all duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        >
          LLCC Admin
        </h2>
      </div>

      <nav className="mt-8">
        {menuItems.map(item => (
          <Link href={item.path} key={item.path}>
            <Button
              className={`
                ${isOpen === true ? 'justify-start w-full' : 'hidden'} mb-2 px-4
                ${pathname === item.path ? 'bg-blue-50 text-blue-600' : ''}
              `}
              variant="light"
            >
              <FontAwesomeIcon icon={item.icon} className={`${!isOpen ? 'mr-0' : 'mr-3'}`} />
              <span className={`${!isOpen ? 'hidden' : 'block'}`}>{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
