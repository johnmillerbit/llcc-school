export async function getScore() {
  try {
    const res = await fetch('/api/v1/admin/score/getScore', {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error('Cannot get score');
    }
    const score = await res.json();
    return score.score;
  } catch (err) {
    console.log(err);
  }
}
