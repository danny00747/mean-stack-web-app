export default function makePatchScoreController({editScoreService, addLogService}) {
    return async function patchScoreController(httpRequest) {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;
            const toEdit = {
                ...userInfo,
                id: httpRequest.params.userId
            };

            const updatedUser = await editScoreService(toEdit);

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {
                        ...updatedUser,
                    }
                }
            }

            logInfo.status = 200;
            logInfo.message = `User info updated successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    message: "User info updated successfully !",
                    updatedUser: {
                        username: updatedUser.username,
                        email: updatedUser.email,
                        score: updatedUser.score,
                        level: updatedUser.level
                    },
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/api/user/${id}`
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
            if (e.name === 'RangeError') {
                return {
                    statusCode: 404,
                    body: {
                        error: e.message
                    }
                }
            }
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
