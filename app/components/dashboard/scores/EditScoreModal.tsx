'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@heroui/react';
import { useState } from 'react';
import type { ScoreElement } from '@/app/types/score';

interface ScoreFormData {
  reading: string;
  word_combination: string;
  speaking: string;
  listening: string;
  grammar: string;
  tense: string;
  translation: string;
}

interface ScoreSubmitData {
  std_id: string;
  term: number;
  reading: string;
  word_combination: string;
  speaking: string;
  listening: string;
  grammar: string;
  tense: string;
  translation: string;
}

interface EditScoreModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentId: string;
  term: number;
  currentScores?: ScoreElement;
  onSubmit: (scores: ScoreSubmitData) => Promise<void>;
}

export default function EditScoreModal({
  isOpen,
  onOpenChange,
  studentId,
  term,
  currentScores,
  onSubmit
}: EditScoreModalProps) {
  const [scores, setScores] = useState<ScoreFormData>({
    reading: currentScores?.reading?.toString() || '',
    word_combination: currentScores?.word_combination?.toString() || '',
    speaking: currentScores?.speaking?.toString() || '',
    listening: currentScores?.listening?.toString() || '',
    grammar: currentScores?.grammar?.toString() || '',
    tense: currentScores?.tense?.toString() || '',
    translation: currentScores?.translation?.toString() || ''
  });

  const handleSubmit = async () => {
    try {
      await onSubmit({
        std_id: studentId,
        term,
        ...scores
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Scores</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Reading"
                  type="number"
                  value={scores.reading}
                  onChange={(e) => setScores({ ...scores, reading: e.target.value })}
                />
                <Input
                  label="Word Combination"
                  type="number"
                  value={scores.word_combination}
                  onChange={(e) => setScores({ ...scores, word_combination: e.target.value })}
                />
                <Input
                  label="Speaking"
                  type="number"
                  value={scores.speaking}
                  onChange={(e) => setScores({ ...scores, speaking: e.target.value })}
                />
                <Input
                  label="Listening"
                  type="number"
                  value={scores.listening}
                  onChange={(e) => setScores({ ...scores, listening: e.target.value })}
                />
                <Input
                  label="Grammar"
                  type="number"
                  value={scores.grammar}
                  onChange={(e) => setScores({ ...scores, grammar: e.target.value })}
                />
                <Input
                  label="Tense"
                  type="number"
                  value={scores.tense}
                  onChange={(e) => setScores({ ...scores, tense: e.target.value })}
                />
                <Input
                  label="Translation"
                  type="number"
                  value={scores.translation}
                  onChange={(e) => setScores({ ...scores, translation: e.target.value })}
                />
              </div>
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