'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Tabs, Tab } from '@heroui/react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { Student } from '@/app/types/student';
import type { ScoreElement } from '@/app/types/score';
import type { EditStudentData } from '@/app/types/editStudent';

type ScoreData = { [key: string]: string };

interface EditStudentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: Student;
  scores: ScoreElement[];
  onSubmit: (data: EditStudentData) => Promise<void>;
}

// Define the type for termSubjects
type TermSubjects = Record<number, string[]>;

// ฟังก์ชันช่วยสร้าง scoreData จาก scores
const createScoreData = (scores: ScoreElement[]): Record<number, ScoreData> => {
  const termSubjects: TermSubjects = {
    1: ['reading', 'speaking', 'grammar', 'word_combination'],
    2: ['reading', 'speaking', 'grammar', 'tense'],
    3: ['reading', 'speaking', 'grammar', 'tense'],
    4: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
    5: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
    6: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
  };

  const subjectMap: Record<string, number> = {
    reading: 3,
    word_combination: 4,
    speaking: 5,
    listening: 6,
    grammar: 7,
    tense: 8,
    translation: 9,
  };

  const initialScores = Object.fromEntries(Object.entries(termSubjects).map(([term, subjects]) => [term, Object.fromEntries(subjects.map(subject => [subject, '']))])) as Record<number, ScoreData>;

  return scores.reduce((acc, { term, subject_id, value }) => {
    const subject = Object.entries(subjectMap).find(([, id]) => id === subject_id)?.[0];
    if (subject && subject in acc[term]) acc[term][subject] = value?.toString() || '';
    return acc;
  }, initialScores);
};

export default function EditStudentModal({ isOpen, onOpenChange, student, scores, onSubmit }: EditStudentModalProps) {
  const [studentData, setStudentData] = useState<Student>(student);
  const [scoreData, setScoreData] = useState<Record<number, ScoreData>>(() => createScoreData(scores));
  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  useEffect(() => {
    setStudentData(student);
    setScoreData(createScoreData(scores));
  }, [student, scores]);

  const handleSubmit = async () => {
    try {
      const subjectMap: Record<string, number> = {
        reading: 3,
        word_combination: 4,
        speaking: 5,
        listening: 6,
        grammar: 7,
        tense: 8,
        translation: 9,
      };
      const formattedScores = Object.entries(scoreData).flatMap(([term, scores]) =>
        Object.entries(subjectMap).map(([subject, subject_id]) => ({
          term: Number(term),
          subject_id,
          value: Number(scores[subject]) || 0,
        }))
      );

      await onSubmit({ ...studentData, scores: formattedScores });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const termSubjects: TermSubjects = {
    1: ['reading', 'speaking', 'grammar', 'word_combination'],
    2: ['reading', 'speaking', 'grammar', 'tense'],
    3: ['reading', 'speaking', 'grammar', 'tense'],
    4: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
    5: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
    6: ['reading', 'speaking', 'grammar', 'listening', 'translation'],
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>Edit Student</ModalHeader>
            <ModalBody>
              <Tabs>
                <Tab key="details" title="Student Details">
                  <div className="space-y-4 p-4">
                    <Input label="First Name" aria-label="First Name" value={studentData.firstname} onChange={e => setStudentData({ ...studentData, firstname: e.target.value })} />
                    <Input label="Last Name" aria-label="Last Name" value={studentData.lastname} onChange={e => setStudentData({ ...studentData, lastname: e.target.value })} />
                    <Select label="Class" aria-label="Class" defaultSelectedKeys={[studentData.class]} onChange={e => setStudentData({ ...studentData, class: e.target.value })}>
                      <SelectItem key="A">Class A</SelectItem>
                      <SelectItem key="B">Class B</SelectItem>
                      <SelectItem key="C">Class C</SelectItem>
                    </Select>
                    <Select label="Semester" aria-label="Semester" defaultSelectedKeys={[studentData.semester]} onChange={e => setStudentData({ ...studentData, semester: e.target.value })}>
                      <SelectItem key="2023-2024">2023-2024</SelectItem>
                      <SelectItem key="2024-2025">2024-2025</SelectItem>
                    </Select>
                    <Input
                      type="date"
                      label="Birthdate"
                      aria-label="Birthdate"
                      defaultValue={format(new Date(studentData.birthdate.toString()), 'yyyy-MM-dd')}
                      onChange={e => setStudentData({ ...studentData, birthdate: e.target.value })}
                    />
                  </div>
                </Tab>
                <Tab key="scores" title="Scores">
                  <div className="space-y-6 p-4">
                    <Select label="Select Term" aria-label="Select Term" defaultSelectedKeys={["1"]} onChange={e => setSelectedTerm(Number(e.target.value))}>
                      <SelectItem key="1">Term 1</SelectItem>
                      <SelectItem key="2">Term 2</SelectItem>
                      <SelectItem key="3">Term 3</SelectItem>
                      <SelectItem key="4">Term 4</SelectItem>
                      <SelectItem key="5">Term 5</SelectItem>
                      <SelectItem key="6">Term 6</SelectItem>
                    </Select>
                    {selectedTerm ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Term {selectedTerm}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {termSubjects[selectedTerm].map((subject: string) => (
                            <Input
                              key={subject}
                              label={subject.charAt(0).toUpperCase() + subject.slice(1).replace('_', ' ')}
                              type="number"
                              value={scoreData[selectedTerm]?.[subject] || ''}
                              onChange={e =>
                                setScoreData({
                                  ...scoreData,
                                  [selectedTerm]: { ...scoreData[selectedTerm], [subject]: e.target.value },
                                })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
