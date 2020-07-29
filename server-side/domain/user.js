export default function buildMakeUser(isValidEmail, hashedPassword, requiredParameter) {
    return ({
                username = requiredParameter('A username'),
                email = requiredParameter('An email'),
                password = requiredParameter('A password'), level = 'A1', score = 0,
                role = 'student', isVerified = false, createdOn = new Date(), reviews = []
            } = {}) => {

        if (typeof username !== 'string') throw new TypeError('A username must be a string.');

        if (username.length < 4 || username.length >= 12)
            throw new RangeError('A username length must be between 4 and 12 .');

        if (typeof email !== 'string') throw new SyntaxError('An email must be of type string.');

        if (!EmailValidation()) throw new SyntaxError('Invalid email.');

        if (typeof password !== 'string') throw new TypeError('The password must be of type string.');

        if (typeof score !== 'number') throw new TypeError('The score must be a number');

        if (score < 0 || score > 10) throw new RangeError('The score must be between 0 and 10.');

        if (typeof reviews !== 'object') throw new TypeError('Reviews must be an array');

      //  if (!makeHash().match(/^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/)) throw new Error('Password not hashed !');

        const levelEnum = {
            A1: "A1", A2: "A2", B1: "B1",
            B2: "B2", C1: "C1", C2: "C2"
        };
        Object.freeze(levelEnum);

        const roleEnum = {ADMIN: "admin", TEACHER: "teacher", STUDENT: "student"};
        Object.freeze(roleEnum);

        if (role !== roleEnum.ADMIN && role !== roleEnum.TEACHER &&
            role !== roleEnum.STUDENT) {
            throw new RangeError('These are the role are allowed : admin, teacher, student');
        }

        return Object.freeze({
            getUsername: () => username,
            getEmail: () => email,
            getPassword: () => hashedPassword(password),
            getReviews: () => reviews,
            getRole: () => role,
            getScore: () => score,
            getVerifiedStatus: () => isVerified,
            getcreatedOn: () => createdOn,
            getLevel: () => getUserLevel(score)
        });

        function EmailValidation() {
            return isValidEmail(email);
        }

        function getUserLevel(UserScore) {
            if (UserScore <= 0 || UserScore < 2) {
                return levelEnum.A1
            } else if (UserScore <= 2 || UserScore < 4) {
                return levelEnum.A2
            } else if (UserScore <= 4 || UserScore < 6) {
                return levelEnum.B1
            } else if (UserScore <= 6 || UserScore < 8) {
                return levelEnum.B2
            } else if (UserScore <= 8 || UserScore <= 9) {
                return levelEnum.C1
            } else {
                return levelEnum.C2
            }
        }
    }
}
