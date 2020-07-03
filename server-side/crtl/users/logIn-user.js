export default function makeSignInUser({logInUser}) {
    return async function signInUser(httpRequest) {
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const {...userInfo} = httpRequest.body;

            const posted = await logInUser({
                ...userInfo,
            });

            if (!posted.success) {
                return {
                    headers,
                    statusCode: 401,
                    body: {...posted}
                }
            }
            return {
                headers,
                statusCode: 200,
                body: {...posted}
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
