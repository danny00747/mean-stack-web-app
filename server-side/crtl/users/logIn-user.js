export default function makeSignInUser({logInUser, bcrypt, jwt}) {
    return async function signInUser(httpRequest) {

        try {
            const {...userInfo} = httpRequest.body;

            const existing = await logInUser({
                ...userInfo,
            });

            if (existing.length === 0) return {
                statusCode: 401,
                body: {success: false, message: "Auth failed !"}
            };

            const [{username, role, email, score, password, _id: id}] = existing;

            if (await bcrypt.compare(userInfo.password, password)) {

                const jwtToken = jwt.sign({email: email, userId: id},
                    process.env["JWT_KEY"], {expiresIn: "1h"}
                );
                return {
                    statusCode: 200,
                    body: {success: true, token: "JWT " + jwtToken,
                        user: {
                            userId: id,
                            username: username,
                            userEmail: email,
                            role: role,
                            score: score
                        }
                    },
                }
            } else {
                return {
                    statusCode: 401,
                    body: {success: false, message: "Auth failed !"}
                }
            }

        } catch (e) {
            // TODO: Error logging
            console.log(e);

            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
