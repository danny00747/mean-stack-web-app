export default function makeDeleteReviewController({removeReviewService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {reviewId: id, userEmail: email} = httpRequest.params;

            const updatedUser = await removeReviewService({id, email});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = updatedUser.message;
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
            logInfo.message = 'Review deleted successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    message: "Review deleted successfully !",
                    updatedUser: {
                        email: email,
                        removedReview: updatedUser.ancientDocument.reviews[updatedUser.index]
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
