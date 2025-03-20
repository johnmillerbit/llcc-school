//StudentSearch.tsx
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import type { Student } from '@/app/types/student';

interface StudentSearchProps {
  student: Student[];
  onSearch: (filtered: Student[]) => void;
}

const semester: Array<{ key: string; lable: string }> = [
  { key: '2023-2024', lable: '2023-2024' },
  { key: '2024-2025', lable: '2024-2025' },
];

const classNumber: Array<{ key: string; lable: string }> = [
  { key: 'a', lable: 'A' },
  { key: 'b', lable: 'B' },
  { key: 'c', lable: 'C' },
];

export default function StudentSearch({ student, onSearch }: StudentSearchProps) {
  const [nameQuery, setNameQuery] = useState('');
  const [semesterQuery, setSemesterQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');

  const filteredStudents = student.filter(student => {
    const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
    const semester = student.semester.toLowerCase();
    const studentClass = student.class.toLowerCase();
    const nameMatch = fullName.includes(nameQuery.toLowerCase());
    const semesterMatch = semester.includes(semesterQuery.toLowerCase());
    const classMatch = !classQuery || studentClass === classQuery.toLowerCase();

    if (!nameQuery && !semesterQuery && !classQuery) return true;
    return nameMatch && semesterMatch && classMatch;
  });

  const handleSearch = () => {
    onSearch(filteredStudents);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-5">
        <Input label="Name" placeholder="Name" onChange={e => setNameQuery(e.target.value)} className="mb-4" />
        <Select onChange={e => setSemesterQuery(e.target.value)} label="Semester">
          {semester.map(semester => (
            <SelectItem key={semester.key}>{semester.lable}</SelectItem>
          ))}
        </Select>
        <Select onChange={e => setClassQuery(e.target.value)} label="Class">
          {classNumber.map(number => (
            <SelectItem key={number.key}>{number.lable}</SelectItem>
          ))}
        </Select>
      </div>
      <Button className="mb-5 w-40 flex justify-self-end" onPress={handleSearch} color="primary">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        Search
      </Button>
    </div>
  );
}
