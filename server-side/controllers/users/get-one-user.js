export default function makeGetOneUserController({getOneUserService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const user = await getOneUserService({id: httpRequest.params.userId});
            if (!user) {

                logInfo.status = 404;
                logInfo.message = `No valid entry found with provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found with provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = `Request successful !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
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
