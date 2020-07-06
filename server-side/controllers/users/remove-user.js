export default function makeDeleteUserController({removeUserService}) {
    return async (httpRequest) => {

        try {
            const deleteUser = await removeUserService({id: httpRequest.params.userId});
            if (!deleteUser) {
                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                statusCode: 200,
                body: {
                    message: "User deleted successfully !",
                    removedUser: {
                        username: deleteUser.username,
                        email: deleteUser.email
                    }
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
