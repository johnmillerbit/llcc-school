'use client';

import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, useDisclosure, addToast, Pagination } from '@heroui/react';

import StudentSearch from './StudentSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '@/app/types/student';
import type { ScoreElement } from '@/app/types/score';
import { getStudent } from '@/app/utils/getStudent';
import StudentScoreView from './StudentScoreView';
import { getScore } from '@/app/utils/getScore';

export const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'NAME', uid: 'name' },
  { name: 'CLASS', uid: 'class' },
  { name: 'SEMESTER', uid: 'semester' },
  { name: 'ACTION', uid: 'actions' },
];

export default function StudentScore() {
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const studentsPerPage = 10; // จำนวนนักเรียนต่อหน้า
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();
  const [loadingScores, setLoadingScores] = useState(false);
  const [oneStudentScore, setOneStudentScore] = useState<ScoreElement[]>();
  const [allStudentScore, setAllStudentScore] = useState<ScoreElement[]>([]);

  const fetchStudents = async () => {
    try {
      const student = await getStudent();
      if (!student) {
        return;
      }
      const studentData = Array.isArray(student) ? student : [];
      setAllStudents(studentData);
      setDisplayedStudents(studentData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchScore = async () => {
    try {
      const res = await getScore();
      setAllStudentScore(res);
    } catch (err) {
      addToast({
        title: 'Oops...',
        description: 'Something went wrong!',
        color: 'danger',
      });
      console.error(err);
    }
  };

  const viewScore = async (id: string) => {
    setLoadingScores(true);
    try {
      const studentScores = allStudentScore.filter((score: ScoreElement) => score.student_id === id);
      setOneStudentScore(studentScores);
    } catch (err) {
      console.error(err);
      addToast({ title: 'Oops...', description: 'Failed to load scores!', color: 'danger' });
    } finally {
      setLoadingScores(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchScore();
  }, []);

  const handleSearch = (filtered: Student[]) => {
    setDisplayedStudents(filtered);
    setCurrentPage(1); // รีเซ็ตกลับไปหน้า 1 เมื่อค้นหา
  };

  const totalPages = Math.ceil(displayedStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = displayedStudents.slice(startIndex, endIndex);

  const renderCell = (student: Student, columnKey: React.Key) => {
    const cellValue = student[columnKey as keyof Student];

    switch (columnKey) {
      case 'id':
        return <div>{cellValue}</div>;
      case 'name':
        return <div>{`${student.firstname} ${student.lastname}`}</div>;
      case 'class':
        return <div>{cellValue}</div>;
      case 'semester':
        return <div>{cellValue}</div>;
      case 'actions':
        return (
          <div className="flex justify-center gap-2">
            <Button
              isIconOnly
              variant="light"
              color="secondary"
              onPress={() => {
                viewScore(student.id);
                onViewOpen();
              }}
            >
              <FontAwesomeIcon className="text-green-500" icon={faEye} />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <StudentSearch student={allStudents} onSearch={handleSearch} />
      <Table aria-label="Student score table with custom cells">
        <TableHeader>
          {columns.map(column => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {currentStudents.map((student: Student) => (
            <TableRow key={student.id}>
              {columns.map(column => (
                <TableCell key={column.uid}>{renderCell(student, column.uid)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination
        total={totalPages}
        page={currentPage}
        onChange={setCurrentPage}
        className='flex justify-center mt-5'
      />
      <StudentScoreView isOpen={isViewOpen} onOpenChange={onViewOpenChange} scores={oneStudentScore} loading={loadingScores} />
    </>
  );
}