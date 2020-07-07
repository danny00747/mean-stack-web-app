export default function makePostUserController({addUserService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;

            const posted = await addUserService({
                ...userInfo,
            });

            if (posted.message) {

                logInfo.status = 409;
                logInfo.message = `${posted.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 409,
                    body: {
                        success: false,
                        ...posted,
                    }
                }
            }

            logInfo.status = 201;
            logInfo.message = `User created successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
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
