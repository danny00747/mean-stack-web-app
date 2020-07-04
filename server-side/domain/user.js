export default function buildMakeUser(isValidEmail, hashPassword) {
    return function makeUser({
                                 username, email, password, level = 'A1',
                                 score = 0, role = 'student', reviews = []
                             } = {}) {

        if (!username) {
            throw new Error('A username is a required.')
        }
        if (typeof username !== 'string') {
            throw new Error('A username must be a string.')
        }
        if (username.length < 4 || username.length >= 9) {
            throw new Error('A username minimum length is 4 and max is 9 .')
        }
        if (!email) {
            throw new Error('An email is required.')
        }
        if (!EmailValidation()) {
            throw new Error('Invalid email.')
        }

        if (typeof email !== 'string') {
            throw new Error('An email must be of type string.')
        }

        if (!password) {
            throw new Error('A password field is required.')
        }

        if (typeof password !== 'string') {
            throw new Error('The password must be of type string.')
        }

        if (typeof score !== 'number') {
            throw new Error('The score must be a number')
        }

        if (score > 10) {
            throw new Error('The max score is 10')
        }

        const levelEnum = {
            A1: "A1", A2: "A2", B1: "B1",
            B2: "B2", C1: "C1", C2: "C2"
        };
        Object.freeze(levelEnum);

        const roleEnum = {ADMIN: "admin", TEACHER: "teacher", STUDENT: "student"};
        Object.freeze(roleEnum);

        if (role !== roleEnum.ADMIN && role !== roleEnum.TEACHER &&
            role !== roleEnum.STUDENT) {
            throw new Error('These are the role are allowed : ' +
                'admin, teacher, student');
        }

        return Object.freeze({
            getUsername: () => username,
            getEmail: () => email,
            getPassword: () => makeHash(),
            getReviews: () => reviews,
            getRole: () => role,
            getScore: () => score,
            getLevel: () => getUserLevel(score)
        });

        function makeHash() {
            return hashPassword(password)
        }

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
