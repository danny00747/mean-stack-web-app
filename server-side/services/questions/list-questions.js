export default function makeListQuestionService({ questionRepository }) {
  return async function listQuestionsService () {
    return questionRepository.findAll();
  }
}
