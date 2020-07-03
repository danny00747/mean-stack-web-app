import buildMakeQuestion from './question'
import buildMakeUser from './user'
import * as EmailValidator from 'email-validator';
import bcrypt from 'bcrypt'

const makeQuestion = buildMakeQuestion();
const makeUser = buildMakeUser(isValidEmail, hashPassword);

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
export {makeQuestion, makeUser}

