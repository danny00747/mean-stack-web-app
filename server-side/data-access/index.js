
import makeQuestionDb from './question-db'
const Question = require("./questionModel");
const questionsDb = makeQuestionDb({ Question });
export default questionsDb

