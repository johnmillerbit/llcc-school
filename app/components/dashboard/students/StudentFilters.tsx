'use client';
import { Input, Select, Button, SelectItem } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';

interface StudentFiltersProps {
  onSearch: (query: string) => void;
  onClassFilter: (classFilter: string) => void;
  onSemesterFilter: (semester: string) => void;
  onAddStudent: () => void;
}

export default function StudentFilters({
  onSearch,
  onClassFilter,
  onSemesterFilter,
  onAddStudent,
}: StudentFiltersProps) {
  const classOptions = [
    { key: '', label: 'All Classes' },
    { key: 'a', label: 'Class A' },
    { key: 'b', label: 'Class B' },
    { key: 'c', label: 'Class C' },
  ];

  const semesterOptions = [
    { key: '', label: 'All Semesters' },
    { key: '2023-2024', label: '2023-2024' },
    { key: '2024-2025', label: '2024-2025' },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search students..."
          startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          onChange={(e) => onSearch(e.target.value)}
        />
        
        <Select
          placeholder="Select class"
          onChange={(e) => onClassFilter(e.target.value)}
        >
          {classOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          placeholder="Select semester"
          onChange={(e) => onSemesterFilter(e.target.value)}
        >
          {semesterOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Button
        color="primary"
        startContent={<FontAwesomeIcon icon={faPlus} />}
        onClick={onAddStudent}
      >
        Add Student
      </Button>
    </div>
  );
}