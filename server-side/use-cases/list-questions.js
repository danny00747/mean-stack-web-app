export default function makeListQuestion({ questionsDb }) {
  return async function listQuestions () {
    return questionsDb.findAll();
  }
}
