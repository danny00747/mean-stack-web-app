export default function makeDeleteUserController({removeUserService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const deleteUser = await removeUserService({id: httpRequest.params.userId});
            if (!deleteUser) {

                logInfo.status = 404;
                logInfo.level = "error";
                logInfo.message = `No valid entry found with provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found with provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = `User deleted successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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


            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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
