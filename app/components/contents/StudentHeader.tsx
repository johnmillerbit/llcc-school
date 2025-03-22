'use client';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function StudentHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-2xl" />
            <h1 className="text-2xl font-bold">LLCC School</h1>
          </div>
          <Button
            color="default"
            variant="bordered"
            className="text-white border-white hover:bg-white/20"
          >
            Student Portal
          </Button>
        </div>
      </div>
    </header>
  );
}