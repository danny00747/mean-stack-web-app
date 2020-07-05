import {makeQuestion} from '../../domain'
export default function makeAddQuestionService ({ questionRepository }) {
  return async function addQuestionService (questionInfo) {
    const question = makeQuestion(questionInfo);
    return questionRepository.save({
      type: question.getType(),
      question: question.getQuestion(),
      answers: question.getAnswers(),
    })
  }
}
