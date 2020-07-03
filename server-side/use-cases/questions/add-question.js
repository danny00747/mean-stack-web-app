import {makeQuestion} from '../../domain'
export default function makeAddQuestion ({ questionsDb }) {
  return async function addQuestion (questionInfo) {
    const question = makeQuestion(questionInfo);
    return questionsDb.save({
      type: question.getType(),
      question: question.getQuestion(),
      answers: question.getAnswers(),
    })
  }
}
