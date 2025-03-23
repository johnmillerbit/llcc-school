'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Tabs, Tab } from '@heroui/react';
import { useState } from 'react';
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

export default function EditStudentModal({ isOpen, onOpenChange, student, scores, onSubmit }: EditStudentModalProps) {
  const [studentData, setStudentData] = useState({
    id: student.id,
    firstname: student.firstname,
    lastname: student.lastname,
    class: student.class,
    semester: student.semester,
    birthdate: student.birthdate,
  });

  const [scoreData, setScoreData] = useState<Record<number, ScoreData>>(() => {
    const initialScores: Record<number, ScoreData> = {};

    const termSubjects: Record<number, ScoreData> = {
      1: { reading: '', speaking: '', grammar: '', word_combination: '' },
      2: { reading: '', speaking: '', grammar: '', tense: '' },
      3: { reading: '', speaking: '', grammar: '', tense: '' },
      4: { reading: '', speaking: '', grammar: '', listening: '', translation: '' },
      5: { reading: '', speaking: '', grammar: '', listening: '', translation: '' },
      6: { reading: '', speaking: '', grammar: '', listening: '', translation: '' },
    };

    [1, 2, 3, 4, 5, 6].forEach(term => {
      initialScores[term] = termSubjects[term];
    });

    scores.forEach(score => {
      const scoreValue = score.value?.toString() || '';
      const termScores = initialScores[score.term];

      if (termScores) {
        switch (score.subject_id) {
          case 3:
            if ('reading' in termScores) termScores.reading = scoreValue;
            break;
          case 4:
            if ('word_combination' in termScores) termScores.word_combination = scoreValue;
            break;
          case 5:
            if ('speaking' in termScores) termScores.speaking = scoreValue;
            break;
          case 6:
            if ('listening' in termScores) termScores.listening = scoreValue;
            break;
          case 7:
            if ('grammar' in termScores) termScores.grammar = scoreValue;
            break;
          case 8:
            if ('tense' in termScores) termScores.tense = scoreValue;
            break;
          case 9:
            if ('translation' in termScores) termScores.translation = scoreValue;
            break;
        }
        initialScores[score.term] = termScores;
      }
    });

    return initialScores;
  });

  const [selectedTerm, setSelectedTerm] = useState<number>(1);

  const handleSubmit = async () => {
    try {
      const formattedScores = Object.entries(scoreData).map(([term, scores]) => ({
        term: Number(term),
        reading: Number(scores.reading) || 0,
        word_combination: Number(scores.word_combination) || 0,
        speaking: Number(scores.speaking) || 0,
        listening: Number(scores.listening) || 0,
        grammar: Number(scores.grammar) || 0,
        tense: Number(scores.tense) || 0,
        translation: Number(scores.translation) || 0,
      }));

      await onSubmit({
        ...studentData,
        scores: formattedScores,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  // กำหนดวิชาตามเทอม
  const termSubjects: Record<number, string[]> = {
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
                    <Input label="First Name" value={studentData.firstname} onChange={e => setStudentData({ ...studentData, firstname: e.target.value })} />
                    <Input label="Last Name" value={studentData.lastname} onChange={e => setStudentData({ ...studentData, lastname: e.target.value })} />
                    <Select label="Class" defaultSelectedKeys={[studentData.class]} onChange={e => setStudentData({ ...studentData, class: e.target.value })}>
                      <SelectItem key="A">Class A</SelectItem>
                      <SelectItem key="B">Class B</SelectItem>
                      <SelectItem key="C">Class C</SelectItem>
                    </Select>
                    <Select label="Semester" value={studentData.semester} defaultSelectedKeys={[studentData.semester]} onChange={e => setStudentData({ ...studentData, semester: e.target.value })}>
                      <SelectItem key="2023-2024">2023-2024</SelectItem>
                      <SelectItem key="2024-2025">2024-2025</SelectItem>
                    </Select>
                    <Input type="date" label="Birthdate" value={studentData.birthdate} onChange={e => setStudentData({ ...studentData, birthdate: e.target.value })} />
                  </div>
                </Tab>
                <Tab key="scores" title="Scores">
                  <div className="space-y-6 p-4">
                    <Select
                      label="Select Term"
                      value={selectedTerm.toString()}
                      onChange={e => setSelectedTerm(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6].map(term => (
                        <SelectItem key={term}>
                          Term {term}
                        </SelectItem>
                      ))}
                    </Select>

                    {/* แสดง input เฉพาะเทอมที่เลือก */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Term {selectedTerm}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {termSubjects[selectedTerm].map(subject => (
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