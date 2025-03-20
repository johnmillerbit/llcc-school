'use client';

import { useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from '@heroui/react';

import StudentSearch from './StudentSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '@/app/types/student';

export const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'NAME', uid: 'name' },
  { name: 'SEMESTER', uid: 'semester' },
  { name: 'CLASS', uid: 'class' },
  { name: 'ACTION', uid: 'actions' },
];

export const students = [
  {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    semester: '2024-2025',
    gender: 'male',
    birthdate: '2000-05-15',
    class: 'A',
  },
  {
    id: '2',
    firstname: 'Jane',
    lastname: 'Smith',
    semester: '2024-2025',
    gender: 'female',
    birthdate: '2001-08-22',
    class: 'B',
  },
  {
    id: '3',
    firstname: 'Alex',
    lastname: 'Johnson',
    semester: '2023-2024',
    gender: 'male',
    birthdate: '1999-12-10',
    class: 'A',
  },
];

export default function StudentScore() {
  const [studentsFromSearch, setStudentsFromSearch] = useState<Student[]>(students);

  const renderCell = (student: Student, columnKey: React.Key) => {
    const cellValue = student[columnKey as keyof Student];

    switch (columnKey) {
      case 'id':
        return <div>{cellValue}</div>;
      case 'name':
        return <div>{`${student.firstname} ${student.lastname}`}</div>;
      case 'semester':
        return <div>{cellValue}</div>;
      case 'class':
        return <div>{cellValue}</div>;
      case 'gender':
        return <div>{cellValue}</div>;
      case 'birthdate':
        return <div>{cellValue}</div>;
      case 'actions':
        return (
          <div className="flex justify-center gap-2">
            <Tooltip content="Details">
              <span className="cursor-pointer active:opacity-50">
                <FontAwesomeIcon icon={faEye} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <StudentSearch student={students} onSearch={filtered => setStudentsFromSearch(filtered)} />
      <Table aria-label="Student score table with custom cells">
        <TableHeader>
          {columns.map(column => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {studentsFromSearch.map((student: Student) => (
            <TableRow key={student.id}>
              {columns.map(column => (
                <TableCell key={column.uid}>{renderCell(student, column.uid)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
