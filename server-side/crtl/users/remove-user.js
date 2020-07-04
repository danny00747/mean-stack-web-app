export default function makeDeleteUser ({ removeUser }) {
    return async function deleteUser (httpRequest) {

        try {
            const deleteUser = await removeUser({ id: httpRequest.params.userId });
            if(!deleteUser){
                return {
                    statusCode : 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                statusCode : 200,
                body: {
                    message: "Question deleted successfully !",
                    removedUser : {
                        username : deleteUser.username,
                        email : deleteUser.email
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
