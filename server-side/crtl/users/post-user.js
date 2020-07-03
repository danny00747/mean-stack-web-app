export default function makePostUser({addUser}) {
    return async function postUser(httpRequest) {
        try {
            const {...userInfo} = httpRequest.body;

            const posted = await addUser({
                ...userInfo,
            });

            if (posted.message) {
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 409,
                    body: {
                        success: false,
                        message: posted.message,
                    }
                }
            }
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 201,
                body: {
                    success: true,
                    message: "User created successfully",
                    user: {
                        userId: posted._id,
                        username: posted.username,
                        userEmail: posted.email,
                        role: posted.role
                    }
                }
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e);

            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
