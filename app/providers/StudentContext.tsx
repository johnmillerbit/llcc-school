import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStudent } from '../utils/getStudent';
import type { Student } from '../types/student';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudent();
        if (Array.isArray(data)) {
          setStudents(data);
        }
      } catch {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <StudentContext.Provider value={{ students, loading, error }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
