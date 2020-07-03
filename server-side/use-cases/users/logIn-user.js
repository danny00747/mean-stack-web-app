export default function makeLogInUser({usersDb, bcrypt, jwt}) {
    return async function logInUser(userInfo) {

        const existing = await usersDb.findPseudo(userInfo.pseudo);

        if (existing.length === 0) return {success: false, message: "Auth failed !"};

        const [{username, role, email, score, password, _id: id}] = existing;

        if (bcrypt.compareSync(userInfo.password, password)) {

            const jwtToken = jwt.sign(
                {
                    email: email,
                    userId: id
                },
                process.env["JWT_KEY"],
                {
                    expiresIn: "1h"
                }
            );
            return {
                success: true,
                token: "JWT " + jwtToken,
                user: {
                    userId: id,
                    username: username,
                    userEmail: email,
                    role: role,
                    score: score
                }
            }
        } else {
            return {success: false, message: "Auth failed !"};
        }
    }
}
