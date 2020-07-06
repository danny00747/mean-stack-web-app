export default function makeGetUsersController({getAllUsersService}) {
    return async () => {

        try {
            const users = await getAllUsersService();

            if (users.length === 0) {
                return {
                    statusCode: 204,
                    body: {message: "No Users found in the database"}
                }
            }
            return {
                statusCode: 200,
                body: [...users]
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
