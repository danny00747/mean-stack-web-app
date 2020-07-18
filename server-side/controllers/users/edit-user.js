import {editUserService} from '../../services/users'
import {addLogService} from '../../services/logs'

export default function makePatchUserController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;

            const updatedUser = await editUserService({id, ...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {
                        success: false,
                        ...updatedUser,
                    }
                }
            }

            if (!updatedUser) {

                logInfo.status = 404;
                logInfo.message = `No valid entry found for provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = `Request successful !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    message: "User info updated successfully",
                    updatedUser: {
                        username: updatedUser.username,
                        email: updatedUser.email
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
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
