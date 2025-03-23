export interface ScoreElement {
  student_id: string;
  subject_id: number;
  term: number;
  reading: number;
  word_combination: number;
  speaking: number;
  listening: number;
  grammar: number;
  tense: number;
  translation: number;
  value?: number;
}
