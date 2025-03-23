'use client';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye, faPencil } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '@/app/types/student';

interface StudentTableProps {
  students: Student[];
  onDelete: (id: string) => void;
  onViewScore: (id: string) => void;
  onEdit: (student: Student) => void;
}

const columns = [
  { name: 'ID', uid: 'id' },
  { name: 'FIRST NAME', uid: 'firstname' },
  { name: 'LAST NAME', uid: 'lastname' },
  { name: 'CLASS', uid: 'class' },
  { name: 'SEMESTER', uid: 'semester' },
  { name: 'ACTIONS', uid: 'actions' },
];

export default function StudentTable({ students, onDelete, onViewScore, onEdit }: StudentTableProps) {
  const renderCell = (student: Student, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return <div className="font-medium">{student.id}</div>;
      case 'firstname':
        return <div>{student.firstname}</div>;
      case 'lastname':
        return <div>{student.lastname}</div>;
      case 'class':
        return <div className="capitalize">{student.class}</div>;
      case 'semester':
        return <div>{student.semester}</div>;
      case 'actions':
        return (
          <div className="flex gap-2 justify-center">
            <Button
              isIconOnly
              color="primary"
              variant="light"
              onPress={() => onViewScore(student.id)}
            >
              <FontAwesomeIcon icon={faEye} />
            </Button>
            <Button
              isIconOnly
              color="warning"
              variant="light"
              onPress={() => onEdit(student)}
            >
              <FontAwesomeIcon icon={faPencil} />
            </Button>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={() => onDelete(student.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="Student table">
      <TableHeader>
        {columns.map((column) => (
          <TableColumn 
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
          >
            {column.name}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            {columns.map((column) => (
              <TableCell key={`${student.id}-${column.uid}`}>
                {renderCell(student, column.uid)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}