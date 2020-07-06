import buildMakeQuestion from './question'
import buildMakeReview from './reviews'
import buildMakeUser from './user'
import EmailValidator from 'email-validator';
import requiredParam  from '../helpers/required-parameter'
import bcrypt from 'bcrypt'

const makeQuestion = buildMakeQuestion(requiredParameter);
const makeReview = buildMakeReview(requiredParameter);
const makeUser = buildMakeUser(isValidEmail, hashPassword, requiredParameter);

 function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function isValidEmail (email) {
    return EmailValidator.validate(email);
}

const entities = Object.freeze({
    makeQuestion, makeUser
});

 function requiredParameter(param) {
  return requiredParam(param)
 }

export default entities
export {makeQuestion, makeUser, makeReview}

