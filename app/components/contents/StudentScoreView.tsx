'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from '@heroui/react';
import { ScoreElement } from '@/app/types/score';
import { motion } from 'framer-motion';

interface StudentScoreViewProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  scores: ScoreElement[] | undefined;
  loading: boolean;
}

const SUBJECT_NAMES: Record<number, string> = {
  3: 'Reading',
  4: 'Word Combination',
  5: 'Speaking',
  6: 'Listening',
  7: 'Grammar',
  8: 'Tense',
  9: 'Translation',
};

export default function StudentScoreView({ isOpen, onOpenChange, scores, loading }: StudentScoreViewProps) {
  const calculateTermAverage = (termScores: ScoreElement[]) => {
    const validScores = termScores.filter(score => score.value !== undefined);
    if (validScores.length === 0) return 0;
    const sum = validScores.reduce((acc, score) => acc + (score.value as number), 0);
    return sum / validScores.length;
  };

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white rounded-2xl',
        header: 'border-b border-gray-200',
        body: 'p-6',
        footer: 'border-t border-gray-200',
      }}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
              <h2 className="text-2xl font-bold">Academic Performance Report</h2>
            </ModalHeader>

            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : scores && scores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(term => {
                    const termScores = scores.filter(score => score.term === term);
                    if (termScores.length === 0) return null;

                    const average = calculateTermAverage(termScores);
                    const getGradeColor = (grade: string) => {
                      switch (grade) {
                        case 'A':
                          return 'text-green-600';
                        case 'B':
                          return 'text-blue-600';
                        case 'C':
                          return 'text-yellow-600';
                        case 'D':
                          return 'text-orange-600';
                        default:
                          return 'text-red-600';
                      }
                    };

                    const grade = average >= 80 ? 'A' : average >= 70 ? 'B' : average >= 60 ? 'C' : average >= 50 ? 'D' : 'F';
                    const gradeColor = getGradeColor(grade);

                    return (
                      <motion.div
                        key={term}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: term * 0.1 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                      >
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h3 className="text-xl font-semibold text-gray-800">Term {term}</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {termScores.map(score => (
                              <div key={score.subject_id} className="flex justify-between items-center">
                                <span className="text-gray-600">{SUBJECT_NAMES[score.subject_id]}</span>
                                <span className="font-semibold">{score.value !== undefined ? score.value.toFixed(2) : "N/A"}</span>
                              </div>
                            ))}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Average</span>
                                <span className="font-bold text-lg">{average.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-600">Grade</span>
                                <span className={`font-bold text-2xl ${gradeColor}`}>{grade}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No scores available for this student</div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose} className="hover:bg-red-50">
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
