import { Card, CardBody, CardHeader } from '@heroui/react';
import StudentScore from './StudentScore';
export default function StudentDashboard() {
  return (
    <Card className="max-w-screen-xl mx-auto mt-20">
      <CardHeader className="flex justify-center">
        <h1 className="text-2xl font-bold">Student Scoreboard</h1>
      </CardHeader>
      <CardBody>
        <StudentScore />
      </CardBody>
    </Card>
  );
}
