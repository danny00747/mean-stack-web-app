import {addReviewService} from '../../services/reviews'
import {addLogService} from '../../services/logs'

export default function makePostReviewController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;

            const updatedUser = await addReviewService({id, ...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {
                        ...updatedUser,
                    }
                }
            }

            logInfo.status = 201;
            logInfo.message = "Review created successfully !";
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 201,
                body: {
                    message: "Review created successfully !",
                    updatedUser: {
                        username: updatedUser.username,
                        email: updatedUser.email,
                        reviews: updatedUser.reviews[(updatedUser.reviews).length - 1]
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
