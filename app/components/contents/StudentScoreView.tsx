// @/app/components/StudentScoreView.tsx
'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableBody, TableRow, TableColumn, TableCell, Button, Spinner } from '@heroui/react';
import { ScoreElement } from '@/app/types/score';
interface StudentScoreViewProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  scores: ScoreElement[] | undefined;
  loading: boolean;
}

const SUBJECT_IDS = {
  READING: 3,
  WORD_COMBINATION: 4,
  SPEAKING: 5,
  LISTENING: 6,
  GRAMMAR: 7,
  TENSE: 8,
  TRANSLATION: 9,
} as const;

export default function StudentScoreView({ isOpen, onOpenChange, scores, loading }: StudentScoreViewProps) {
  return (
    <Modal size="5xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader>View Student Scores</ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spinner label="Loading scores..." color="primary" />
                </div>
              ) : scores && scores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1,2,3,4,5,6].map(term => {
                    const termScores = scores.filter(score => score.term === term);
                    return (
                      <Table key={term} isStriped aria-label={`Term ${term}`}>
                        <TableHeader>
                          <TableColumn>Subjects (Term {term})</TableColumn>
                          <TableColumn>Scale 100</TableColumn>
                        </TableHeader>
                        <TableBody>
                          <>
                            {termScores.map(score => {
                              const subjectName = (() => {
                                switch (score.subject_id) {
                                  case SUBJECT_IDS.READING:
                                    return 'Start Reading 2';
                                  case SUBJECT_IDS.WORD_COMBINATION:
                                    return 'Words Combination';
                                  case SUBJECT_IDS.SPEAKING:
                                    return 'General Speaking 1';
                                  case SUBJECT_IDS.LISTENING:
                                    return 'Listening Skills';
                                  case SUBJECT_IDS.GRAMMAR:
                                    return 'Grammar for Elementary I';
                                  case SUBJECT_IDS.TENSE:
                                    return 'Tense Mastery';
                                  case SUBJECT_IDS.TRANSLATION:
                                    return 'Translation Basics';
                                  default:
                                    return 'Unknown Subject';
                                }
                              })();

                              return (
                                <TableRow key={`${term}-${score.subject_id}`}>
                                  <TableCell>{subjectName}</TableCell>
                                  <TableCell>{score.value}</TableCell>
                                </TableRow>
                              );
                            })}
                            <TableRow key={`${term}-average`}>
                              <TableCell>Average Point</TableCell>
                              <TableCell>{termScores.length > 0 ? (termScores.reduce((acc, score) => acc + Number(score.value), 0) / termScores.length).toFixed(2) : 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow key={`${term}-grade`}>
                              <TableCell>Grade</TableCell>
                              <TableCell>
                                {(() => {
                                  const average = termScores.length > 0 ? termScores.reduce((acc, score) => acc + Number(score.value), 0) / termScores.length : 0;
                                  if (average >= 90) return 'A';
                                  if (average >= 80) return 'B';
                                  if (average >= 70) return 'C';
                                  if (average >= 60) return 'D';
                                  return 'F';
                                })()}
                              </TableCell>
                            </TableRow>
                          </>
                        </TableBody>
                      </Table>
                    );
                  })}
                </div>
              ) : (
                <div>No scores available for any term</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
