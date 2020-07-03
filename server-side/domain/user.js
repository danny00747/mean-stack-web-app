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
        if (username.length <= 4 || username.length >= 9) {
            throw new Error('A username minimum length is 4 and max is 9 .')
        }
        if (!EmailValidation()) {
            throw new Error('Invalid email.')
        }
        if (!email) {
            throw new Error('An email is required.')
        }
        if (typeof email !== 'string') {
            throw new Error('An email must be of type string.')
        }

        if (!password) {
            throw new Error('A password field is required.')
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
            throw new Error('These are the types are allowed : admin, teacher, student');
        }

        return Object.freeze({
            getUsername: () => username,
            getEmail: () => email,
            getPassword: () => makeHash(),
            getReviews: () => reviews,
            getRole: () => role,
            getscore: () => score
        });

        function makeHash() {
            return hashPassword(password)
        }

        function EmailValidation() {
            return isValidEmail(email);
        }
    }
}
