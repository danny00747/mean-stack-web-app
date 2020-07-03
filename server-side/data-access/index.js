import makeQuestionDb from './question-db'
import makeUserDb from './user-db'
import Question from './models/questions'
import User from './models/users'

const questionsDb = makeQuestionDb({ Question });
const usersDb = makeUserDb({ User});

export default questionsDb
export {questionsDb, usersDb}

