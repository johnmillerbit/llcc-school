export async function getStudent() {
  try {
    const response = await fetch('/api/v1/admin/getStudent', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('can not get student');
    }
    const data = await response.json();
    const student = data.students;
    return student;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
