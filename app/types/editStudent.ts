export interface EditStudentData {
  id: string;
  firstname: string;
  lastname: string;
  class: string;
  semester: string;
  birthdate: string;
  scores: {
    term: number;
    reading: number;
    word_combination: number;
    speaking: number;
    listening: number;
    grammar: number;
    tense: number;
    translation: number;
  }[];
}