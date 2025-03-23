export interface EditStudentData {
  id: string;
  firstname: string;
  lastname: string;
  class: string;
  semester: string;
  birthdate: string;
  scores: {
    term: number;
    subject_id: number;
    value: number;
  }[];
}