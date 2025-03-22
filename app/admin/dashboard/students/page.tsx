'use client';
import { useState, useEffect } from 'react';
import { useDisclosure, Pagination, addToast } from '@heroui/react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import StudentTable from '@/app/components/dashboard/students/StudentTable';
import StudentFilters from '@/app/components/dashboard/students/StudentFilters';
import AddStudentModal from '@/app/components/dashboard/students/AddStudentModal';
import { getStudent } from '@/app/utils/getStudent';
import type { Student } from '@/app/types/student';
import Swal from 'sweetalert2';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudent();
      if (Array.isArray(data)) {
        setStudents(data);
        setFilteredStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      addToast({
        title: 'Error',
        description: 'Failed to fetch students',
        color: 'danger',
      });
    }
  };

  const handleSearch = (query: string) => {
    const filtered = students.filter((student) => {
      const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
      const searchQuery = query.toLowerCase();
      return fullName.includes(searchQuery) || student.id.toLowerCase().includes(searchQuery);
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleClassFilter = (classFilter: string) => {
    const filtered = students.filter((student) => 
      !classFilter || student.class.toLowerCase() === classFilter.toLowerCase()
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleSemesterFilter = (semester: string) => {
    const filtered = students.filter((student) => 
      !semester || student.semester === semester
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleAddStudent = async (studentData: {
    firstname: string;
    lastname: string;
    class: string;
    semester: string;
    birthdate: string;
  }) => {
    try {
      const response = await fetch('/api/v1/admin/addStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to add student');
      }

      addToast({
        title: 'Success',
        description: 'Student added successfully',
        color: 'success',
      });

      fetchStudents();
      onOpenChange();
    } catch (error) {
      console.error('Error adding student:', error);
      addToast({
        title: 'Error',
        description: 'Failed to add student',
        color: 'danger',
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await fetch('/api/v1/admin/deleteStudent', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete student');
        }

        await fetchStudents();
        addToast({
          title: 'Success',
          description: 'Student deleted successfully',
          color: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      addToast({
        title: 'Error',
        description: 'Failed to delete student',
        color: 'danger',
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Students Management</h1>
        </div>

        <StudentFilters
          onSearch={handleSearch}
          onClassFilter={handleClassFilter}
          onSemesterFilter={handleSemesterFilter}
          onAddStudent={onOpen}
        />

        <StudentTable 
          students={currentStudents}
          onDelete={handleDeleteStudent}
        />

        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>

        <AddStudentModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSubmit={handleAddStudent}
        />
      </div>
    </DashboardLayout>
  );
}