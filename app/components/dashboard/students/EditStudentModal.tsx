'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Tabs, Tab } from '@heroui/react';
import { useState } from 'react';
import type { Student } from '@/app/types/student';
import type { ScoreElement } from '@/app/types/score';
import type { EditStudentData } from '@/app/types/editStudent';

interface ScoreData {
    reading: string;
    word_combination: string;
    speaking: string;
    listening: string;
    grammar: string;
    tense: string;
    translation: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student: Student;
  scores: ScoreElement[];
  onSubmit: (data: EditStudentData) => Promise<void>;
}

export default function EditStudentModal({
  isOpen,
  onOpenChange,
  student,
  scores,
  onSubmit
}: EditStudentModalProps) {
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
    
    [1, 2, 3, 4, 5, 6].forEach(term => {
      initialScores[term] = {
          reading: '',
          word_combination: '',
          speaking: '',
          listening: '',
          grammar: '',
          tense: '',
          translation: ''
        };
    });

    scores.forEach(score => {
      const scoreValue = score.value?.toString() || '';
      
      const termScores = initialScores[score.term] || {
        reading: '',
        word_combination: '',
        speaking: '',
        listening: '',
        grammar: '',
        tense: '',
        translation: ''
  };

      switch (score.subject_id) {
        case 3:
          termScores.reading = scoreValue;
          break;
        case 4:
          termScores.word_combination = scoreValue;
          break;
        case 5:
          termScores.speaking = scoreValue;
          break;
        case 6:
          termScores.listening = scoreValue;
          break;
        case 7:
          termScores.grammar = scoreValue;
          break;
        case 8:
          termScores.tense = scoreValue;
          break;
        case 9:
          termScores.translation = scoreValue;
          break;
      }

      initialScores[score.term] = termScores;
    });

    return initialScores;
  });

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
        translation: Number(scores.translation) || 0
      }));

      await onSubmit({
        ...studentData,
        scores: formattedScores
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Student</ModalHeader>
            <ModalBody>
              <Tabs>
                <Tab key="details" title="Student Details">
                  <div className="space-y-4 p-4">
                    <Input
                      label="First Name"
                      value={studentData.firstname}
                      onChange={(e) => setStudentData({ ...studentData, firstname: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={studentData.lastname}
                      onChange={(e) => setStudentData({ ...studentData, lastname: e.target.value })}
                    />
                    <Select
                      label="Class"
                      value={studentData.class}
                      onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
                    >
                      <SelectItem key="a">Class A</SelectItem>
                      <SelectItem key="b">Class B</SelectItem>
                      <SelectItem key="c">Class C</SelectItem>
                    </Select>
                    <Select
                      label="Semester"
                      value={studentData.semester}
                      onChange={(e) => setStudentData({ ...studentData, semester: e.target.value })}
                    >
                      <SelectItem key="2023-2024">2023-2024</SelectItem>
                      <SelectItem key="2024-2025">2024-2025</SelectItem>
                    </Select>
                    <Input
                      type="date"
                      label="Birthdate"
                      value={studentData.birthdate}
                      onChange={(e) => setStudentData({ ...studentData, birthdate: e.target.value })}
                    />
                  </div>
                </Tab>
                <Tab key="scores" title="Scores">
                  <div className="space-y-6 p-4">
                    {[1, 2, 3, 4, 5, 6].map((term) => (
                      <div key={term} className="space-y-4">
                        <h3 className="text-lg font-semibold">Term {term}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Reading"
                            type="number"
                            value={scoreData[term]?.reading || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], reading: e.target.value }
                            })}
                          />
                          <Input
                            label="Word Combination"
                            type="number"
                            value={scoreData[term]?.word_combination || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], word_combination: e.target.value }
                            })}
                          />
                          <Input
                            label="Speaking"
                            type="number"
                            value={scoreData[term]?.speaking || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], speaking: e.target.value }
                            })}
                          />
                          <Input
                            label="Listening"
                            type="number"
                            value={scoreData[term]?.listening || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], listening: e.target.value }
                            })}
                          />
                          <Input
                            label="Grammar"
                            type="number"
                            value={scoreData[term]?.grammar || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], grammar: e.target.value }
                            })}
                          />
                          <Input
                            label="Tense"
                            type="number"
                            value={scoreData[term]?.tense || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], tense: e.target.value }
                            })}
                          />
                          <Input
                            label="Translation"
                            type="number"
                            value={scoreData[term]?.translation || ''}
                            onChange={(e) => setScoreData({
                              ...scoreData,
                              [term]: { ...scoreData[term], translation: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    ))}
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