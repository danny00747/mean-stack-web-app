import buildMakeQuestion from './question'
import buildMakeReview from './reviews'
import buildMakeUser from './user'
import EmailValidator from 'email-validator';
import bcrypt from 'bcrypt'

const makeQuestion = buildMakeQuestion();
const makeReview = buildMakeReview();
const makeUser = buildMakeUser(isValidEmail, hashPassword, makeReview);

 function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function isValidEmail (email) {
    return EmailValidator.validate(email);
}

const entities = Object.freeze({
    makeQuestion, makeUser
});

export default entities
export {makeQuestion, makeUser, makeReview}

