export default function makeGetUsers ({ getAllUsers }) {
    return async function getUsers() {
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const users = await getAllUsers();

            if (users.length === 0){
                return {
                    headers,
                    statusCode: 204,
                    body: {message: "No Users found in the database"}
                }
            }
            return {
                headers,
                statusCode: 200,
                body: [...users]
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
