import {logInUserService} from '../../services/users'
import {addLogService} from '../../services/logs'

export default function makeSignInUserController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        // TODO: Check the request body

        try {
            const {pseudo, password} = httpRequest.body;

            const user = await logInUserService({pseudo, password});

            if (user.message) {

                logInfo.status = 401;
                logInfo.message = 'Authentication failed !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 401,
                    body: {success: false, ...user}
                };
            }

            if (user.isVerified === false) {

                logInfo.status = 401;
                logInfo.message = 'Your account has not been verified.';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 401,
                    body: {success: false, ...user,
                        message: "Your account has not been verified."}
                };
            }

            const {username, role, email, score, _id: id} = user.existing;

            logInfo.status = 200;
            logInfo.message = 'Authentication successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    success: true, token: user.token,
                    user: {
                        userId: id,
                        username: username,
                        userEmail: email,
                        role: role,
                        score: score
                    }
                }
            }

        } catch (e) {

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
