export default function makeGetOneUser({getOneUser}) {
    return async function getUser(httpRequest) {
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const user = await getOneUser({id: httpRequest.params.userId});
            if (!user) {
                return {
                    headers,
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                headers,
                statusCode: 200,
                body: {
                    user: {
                        userId: user._id,
                        email: user.email,
                        username: user.username,
                        role: user.role,
                        level: user.level,
                        password: user.password
                    },
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/api/user/${user._id}`
                    }
                }
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e);
            return {
                headers,
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
