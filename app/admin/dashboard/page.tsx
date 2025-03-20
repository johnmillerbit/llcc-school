'use client';

import {
  Button,
  Card,
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  addToast,
} from '@heroui/react';
import StudentSearch from '@/app/components/contents/StudentSearch';
import { columns } from '@/app/components/contents/StudentScore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useCallback } from 'react';
import { getStudent } from '@/app/utils/getStudent';
import { getScore } from '@/app/utils/getScore';
import { Student } from '@/app/types/student';
import Swal from 'sweetalert2';
import { ScoreElement } from '@/app/types/score';
import StudentScoreView from '@/app/components/contents/StudentScoreView';

const SUBJECT_IDS = {
  READING: 3,
  WORD_COMBINATION: 4,
  SPEAKING: 5,
  LISTENING: 6,
  GRAMMAR: 7,
  TENSE: 8,
  TRANSLATION: 9,
} as const;

export default function Dashboard() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [stdClass, setStdClass] = useState('');
  const [semester, setSemester] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isAddStudent, setIsAddStudent] = useState(false);
  const [isDeleteStudent, setIsDeleteStudent] = useState<{
    [key: string]: boolean;
  }>({});
  const [editTerm, setEditTerm] = useState<number | null>(null);

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allStudentScore, setAllStudentScore] = useState<ScoreElement[]>([]);
  const [oneStudentScore, setOneStudentScore] = useState<ScoreElement[]>();
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([]);
  const [loadingScores, setLoadingScores] = useState(false);
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onOpenChange: onViewOpenChange } = useDisclosure();

  // Score states as numbers
  const [reading, setReading] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState<number | null>(null);
  const [listening, setListening] = useState<number | null>(null);
  const [grammar, setGrammar] = useState<number | null>(null);
  const [tense, setTense] = useState<number | null>(null);
  const [wordComb, setWordComb] = useState<number | null>(null);
  const [translation, setTranslation] = useState<number | null>(null);
  const [stdIdEditScore, setStdIdEditScore] = useState<string>('');
  const [isEditScoreCorrect, setIsEditScoreCorrect] = useState(false);

  const resetSubjectValue = () => {
    setReading(null);
    setSpeaking(null);
    setListening(null);
    setGrammar(null);
    setTense(null);
    setWordComb(null);
    setTranslation(null);
  };

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

  const handleAddStudent = async () => {
    setIsAddStudent(true);
    try {
      const form = new FormData();
      form.append('firstname', firstname);
      form.append('lastname', lastname);
      form.append('stdClass', stdClass);
      form.append('semester', semester);
      form.append('birthDate', birthDate);

      const res = await fetch('/api/v1/admin/addStudent', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        throw new Error('Failed to add student');
      }
    } catch (err) {
      addToast({
        title: 'Oops...',
        description: 'Something went wrong!',
        color: 'danger',
      });
      console.error(err);
    } finally {
      setIsAddStudent(false);
    }
  };

  const deleteStudent = async (id: string) => {
    setIsDeleteStudent(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch('/api/v1/admin/deleteStudent', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Cannot delete this student: ${id}`);
      }
      const deleteStudent = allStudents.filter(student => student.id !== id);
      setAllStudents(deleteStudent);
      setDisplayedStudents(deleteStudent);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your file has been deleted.',
        icon: 'success',
      });
      fetchStudents();
    } catch (err) {
      addToast({
        title: 'Oops...',
        description: 'Something went wrong!',
        color: 'danger',
      });
      console.error(err);
    } finally {
      setIsDeleteStudent(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleEditScore = async () => {
    try {
      const res = await fetch('/api/v1/admin/score/editScore', {
        method: 'PUT',
        body: JSON.stringify({
          std_id: stdIdEditScore,
          term: editTerm,
          reading,
          speaking,
          grammar,
          wordCombination: wordComb,
          tense,
          listening,
          translation,
        }),
      });

      if (!res.ok) {
        throw new Error('Cannot edit score');
      }
      fetchScore();
    } catch (err) {
      addToast({
        title: 'Oops...',
        description: 'Something went wrong!',
        color: 'danger',
      });
      console.error(err);
    } finally {
      setStdIdEditScore('');
      resetSubjectValue();
      setEditTerm(null);
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

  const fillScore = useCallback(async () => {
    try {
      resetSubjectValue();

      const studentScores = allStudentScore.filter((score: ScoreElement) => score.student_id === stdIdEditScore && score.term === editTerm);

      if (!studentScores.length) {
        return;
      }

      studentScores.forEach((score: ScoreElement) => {
        const numericValue = Number(score.value);
        switch (score.subject_id) {
          case SUBJECT_IDS.READING:
            setReading(numericValue);
            break;
          case SUBJECT_IDS.WORD_COMBINATION:
            setWordComb(numericValue);
            break;
          case SUBJECT_IDS.SPEAKING:
            setSpeaking(numericValue);
            break;
          case SUBJECT_IDS.LISTENING:
            setListening(numericValue);
            break;
          case SUBJECT_IDS.GRAMMAR:
            setGrammar(numericValue);
            break;
          case SUBJECT_IDS.TENSE:
            setTense(numericValue);
            break;
          case SUBJECT_IDS.TRANSLATION:
            setTranslation(numericValue);
            break;
        }
      });
    } catch (err) {
      addToast({
        title: 'Oops...',
        description: 'Something went wrong!',
        color: 'danger',
      });
      console.error('Error filling scores:', err);
    }
  }, [allStudentScore, editTerm, stdIdEditScore]);

  useEffect(() => {
    fillScore();
  }, [editTerm, fillScore]);

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

  const checkEditCorrect = useCallback(() => {
    setIsEditScoreCorrect(false);

    const scores = [reading, speaking, listening, grammar, tense, wordComb, translation];

    const isValid = scores.every(score => {
      if (score === null) return true;
      return score >= 0 && score <= 100;
    });

    setIsEditScoreCorrect(isValid && editTerm !== null);
  }, [reading, speaking, listening, grammar, tense, wordComb, translation, editTerm]);

  useEffect(() => {
    checkEditCorrect();
  }, [checkEditCorrect]);

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
          <div className="flex justify-center gap-5">
            <Button
              onPress={async () => {
                viewScore(student.id);
                onViewOpen();
              }}
              color="secondary"
              isIconOnly
              variant="light"
            >
              <FontAwesomeIcon className="text-green-500" icon={faEye} />
            </Button>
            <Button
              color="secondary"
              onPress={() => {
                onEditOpen();
                setStdIdEditScore(student.id);
                resetSubjectValue();
                setEditTerm(null);
              }}
              isIconOnly
              variant="light"
            >
              <FontAwesomeIcon className="text-blue-500" icon={faPenToSquare} />
            </Button>
            <Button
              isLoading={isDeleteStudent[student.id]}
              onPress={() => {
                Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!',
                }).then(result => {
                  if (result.isConfirmed) {
                    deleteStudent(student.id);
                  }
                });
              }}
              color="danger"
              isIconOnly
              variant="light"
            >
              <FontAwesomeIcon className="text-red-500" icon={faTrash} />
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchScore();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto mt-20">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <div className="flex gap-3">
          <Button color="primary" onPress={onAddOpen}>
            <FontAwesomeIcon icon={faPlus} />
            Add student
          </Button>
          <Modal isOpen={isAddOpen} onOpenChange={onAddOpenChange}>
            <ModalContent>
              {onClose => (
                <>
                  <ModalHeader>Add Student</ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-3">
                      <Input label="First name" placeholder="Enter first name" onChange={e => setFirstName(e.target.value)} />
                      <Input label="Last name" placeholder="Enter last name" onChange={e => setLastName(e.target.value)} />
                      <Select aria-label="add student" label="Class" placeholder="Enter class" onChange={e => setStdClass(e.target.value)}>
                        <SelectItem key="A">A</SelectItem>
                        <SelectItem key="B">B</SelectItem>
                        <SelectItem key="C">C</SelectItem>
                      </Select>
                      <Input label="Semester" placeholder="Enter semester" onChange={e => setSemester(e.target.value)} />
                      <Input type="date" label="Birth date" onChange={e => setBirthDate(e.target.value)} />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      isLoading={isAddStudent}
                      color="primary"
                      onPress={() => {
                        handleAddStudent().then(() => {
                          fetchStudents();
                        });
                        setTimeout(() => {
                          onClose();
                        }, 1000);
                      }}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
      <Card className="mt-10">
        <CardBody>
          <StudentSearch student={allStudents} onSearch={filtered => setDisplayedStudents(filtered)} />
          <Table aria-label="Student score table with custom cells">
            <TableHeader>
              {columns.map(column => (
                <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                  {column.name}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {displayedStudents.map((student: Student) => (
                <TableRow key={student.id}>
                  {columns.map(column => (
                    <TableCell key={column.uid}>{renderCell(student, column.uid)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Edit Student</ModalHeader>
              <ModalBody>
                <Select label="Select term" placeholder="Enter term" onChange={e => setEditTerm(Number(e.target.value))}>
                  <SelectItem key="1">1</SelectItem>
                  <SelectItem key="2">2</SelectItem>
                  <SelectItem key="3">3</SelectItem>
                  <SelectItem key="4">4</SelectItem>
                  <SelectItem key="5">5</SelectItem>
                  <SelectItem key="6">6</SelectItem>
                </Select>
                {editTerm === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Word Combin"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={wordComb?.toString() || ''}
                      onChange={e => setWordComb(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
                {editTerm === 2 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Tense"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={tense?.toString() || ''}
                      onChange={e => setTense(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
                {editTerm === 3 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Tense"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={tense?.toString() || ''}
                      onChange={e => setTense(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
                {editTerm === 4 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Listening"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={listening?.toString() || ''}
                      onChange={e => setListening(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Translation"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={translation?.toString() || ''}
                      onChange={e => setTranslation(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
                {editTerm === 5 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Listening"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={listening?.toString() || ''}
                      onChange={e => setListening(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Translation"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={translation?.toString() || ''}
                      onChange={e => setTranslation(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
                {editTerm === 6 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Reading"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={reading?.toString() || ''}
                      onChange={e => setReading(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Speaking"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={speaking?.toString() || ''}
                      onChange={e => setSpeaking(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Grammar"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={grammar?.toString() || ''}
                      onChange={e => setGrammar(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Listening"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={listening?.toString() || ''}
                      onChange={e => setListening(e.target.value ? Number(e.target.value) : null)}
                    />
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      label="Translation"
                      placeholder="ກະລຸນາປ້ອນຄະແນນ"
                      value={translation?.toString() || ''}
                      onChange={e => setTranslation(e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button
                  isDisabled={!isEditScoreCorrect}
                  color="primary"
                  onPress={() => {
                    handleEditScore();
                    onClose();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <StudentScoreView isOpen={isViewOpen} onOpenChange={onViewOpenChange} scores={oneStudentScore} loading={loadingScores} />
    </div>
  );
}
