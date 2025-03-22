'use client';
import { useState } from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import type { Student } from '@/app/types/student';

interface StudentSearchProps {
  student: Student[];
  onSearch: (filtered: Student[]) => void;
}

export default function StudentSearch({ student, onSearch }: StudentSearchProps) {
  const [nameQuery, setNameQuery] = useState('');
  const [semesterQuery, setSemesterQuery] = useState('');
  const [classQuery, setClassQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleReset = () => {
    setNameQuery('');
    setSemesterQuery('');
    setClassQuery('');
    onSearch(student);
  };

  const handleSearch = () => {
    const filteredStudents = student.filter(student => {
      const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
      const semester = student.semester.toLowerCase();
      const studentClass = student.class.toLowerCase();
      
      const nameMatch = fullName.includes(nameQuery.toLowerCase());
      const semesterMatch = !semesterQuery || semester === semesterQuery.toLowerCase();
      const classMatch = !classQuery || studentClass === classQuery.toLowerCase();

      return nameMatch && semesterMatch && classMatch;
    });
    onSearch(filteredStudents);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="Search by student name..."
              startContent={<FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400" />}
              className="w-full"
              size="lg"
            />
          </div>
          <Button
            color="primary"
            variant="flat"
            onPress={() => setIsFilterOpen(!isFilterOpen)}
            startContent={<FontAwesomeIcon icon={faFilter} />}
          >
            Filters
      </Button>
    </div>

        <motion.div
          initial={false}
          animate={{ height: isFilterOpen ? 'auto' : 0, opacity: isFilterOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Select
              label="Semester"
              value={semesterQuery}
              onChange={(e) => setSemesterQuery(e.target.value)}
              className="w-full"
            >
              <SelectItem key="" value="">All Semesters</SelectItem>
              <SelectItem key="2023-2024" value="2023-2024">2023-2024</SelectItem>
              <SelectItem key="2024-2025" value="2024-2025">2024-2025</SelectItem>
            </Select>

            <Select
              label="Class"
              value={classQuery}
              onChange={(e) => setClassQuery(e.target.value)}
              className="w-full"
            >
              <SelectItem key="" value="">All Classes</SelectItem>
              <SelectItem key="a" value="a">Class A</SelectItem>
              <SelectItem key="b" value="b">Class B</SelectItem>
              <SelectItem key="c" value="c">Class C</SelectItem>
            </Select>
          </div>
        </motion.div>

        <div className="flex justify-end space-x-3">
          {(nameQuery || semesterQuery || classQuery) && (
            <Button
              color="default"
              variant="light"
              onPress={handleReset}
              startContent={<FontAwesomeIcon icon={faTimesCircle} />}
            >
              Reset
            </Button>
          )}
          <Button
            color="primary"
            onPress={handleSearch}
            startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
