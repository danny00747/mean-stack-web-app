import {addUserService} from '../../services/users'
import {addLogService} from '../../services/logs'
import sendMail from '../../helpers/sendMail'

export default function makePostUserController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;

            const posted = await addUserService({...userInfo});

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

          sendMail(posted.createdUser.email, posted.key.randomKey);

            return {
                statusCode: 201,
                body: {
                    success: true,
                    key: posted.key.randomKey,
                    message: "A verification email has been sent to "
                        + posted.createdUser.email,
                    user: {
                        userId: posted.createdUser._id,
                        username: posted.createdUser.username,
                        userEmail: posted.createdUser.email,
                        role: posted.createdUser.role
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
