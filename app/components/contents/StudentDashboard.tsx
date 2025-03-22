'use client'
import { Card, CardBody, CardHeader } from '@heroui/react';
import StudentScore from './StudentScore';
import StudentHeader from './StudentHeader';
export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Student Scoreboard</h2>
      </CardHeader>
          <CardBody>
        <StudentScore />
      </CardBody>
    </Card>
      </div>
    </div>
  );
}
