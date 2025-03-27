export type EventLog = {
  id: number;
  status: string;
  old_value: string;
  new_value: string;
  update_at: string;
  do_by: number;
  term: number;
  teacher: {
    username: string;
  };
  student: {
    firstname: string;
    lastname: string;
  };
  subject: {
    name: string;
  };
};
