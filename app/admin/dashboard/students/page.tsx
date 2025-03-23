'use client';
import { useState, useEffect } from 'react';
import { useDisclosure, Pagination, addToast } from '@heroui/react';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import StudentTable from '@/app/components/dashboard/students/StudentTable';
import StudentFilters from '@/app/components/dashboard/students/StudentFilters';
import AddStudentModal from '@/app/components/dashboard/students/AddStudentModal';
import EditStudentModal from '@/app/components/dashboard/students/EditStudentModal';
import StudentScoreView from '@/app/components/contents/StudentScoreView';
import { getStudent } from '@/app/utils/getStudent';
import { getScore } from '@/app/utils/getScore';
import type { Student } from '@/app/types/student';
import type { ScoreElement } from '@/app/types/score';
import type { EditStudentData } from '@/app/types/editStudent';
import Swal from 'sweetalert2';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [scores, setScores] = useState<ScoreElement[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const [selectedStudentScores, setSelectedStudentScores] = useState<ScoreElement[]>();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isScoreOpen, onOpen: onScoreOpen, onOpenChange: onScoreOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
    fetchScores();
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

  const fetchScores = async () => {
    try {
      const data = await getScore();
      if (Array.isArray(data)) {
        setScores(data);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = students.filter(student => {
      const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();
      const searchQuery = query.toLowerCase();
      return fullName.includes(searchQuery) || student.id.toLowerCase().includes(searchQuery);
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleClassFilter = (classFilter: string) => {
    const filtered = students.filter(student => !classFilter || student.class.toLowerCase() === classFilter.toLowerCase());
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleSemesterFilter = (semester: string) => {
    const filtered = students.filter(student => !semester || student.semester === semester);
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleAddStudent = async (studentData: { firstname: string; lastname: string; stdClass: string; semester: string; birthdate: string }) => {
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
        confirmButtonText: 'Yes, delete it!',
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

  const handleViewScore = (studentId: string) => {
    setLoadingScores(true);
    try {
      const studentScores = scores.filter(score => score.student_id === studentId);
      setSelectedStudentScores(studentScores);
      onScoreOpen();
    } catch (error) {
      console.error('Error loading scores:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load student scores',
        color: 'danger',
      });
    } finally {
      setLoadingScores(false);
    }
  };

  // const handleEdit = (student: Student) => {
  //   setSelectedStudent(null)
  //   setSelectedStudent(student);
  //   console.log(student.id)
  //   onEditOpen();
  // };

  const handleEditSubmit = async (data: EditStudentData) => {
    try {
      const response = await fetch('/api/v1/admin/editStudent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      addToast({
        title: 'Success',
        description: 'Student updated successfully',
        color: 'success',
      });

      fetchStudents();
      onEditOpenChange();
    } catch (error) {
      console.error('Error updating student:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update student',
        color: 'danger',
      });
    }
  };

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

        <StudentFilters onSearch={handleSearch} onClassFilter={handleClassFilter} onSemesterFilter={handleSemesterFilter} onAddStudent={onOpen} />

        <StudentTable
          students={currentStudents}
          onDelete={handleDeleteStudent}
          onViewScore={handleViewScore}
          onEdit={e => {
            setSelectedStudent(e);
            console.log(selectedStudent)
            onEditOpen()
          }}
        />

        <div className="flex justify-center mt-4">
          <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} />
        </div>

        <AddStudentModal isOpen={isOpen} onOpenChange={onOpenChange} onSubmit={handleAddStudent} />

        <StudentScoreView isOpen={isScoreOpen} onOpenChange={onScoreOpenChange} scores={selectedStudentScores} loading={loadingScores} />

        {selectedStudent && (
          <EditStudentModal
            isOpen={isEditOpen}
            onOpenChange={onEditOpenChange}
            student={selectedStudent}
            scores={scores.filter(score => score.student_id === selectedStudent.id)}
            onSubmit={handleEditSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
