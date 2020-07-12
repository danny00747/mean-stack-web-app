export default function makePatchReviewController({editReviewService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;
            const {reviewId: id, userEmail: email} = httpRequest.params;
            const toEdit = {...userInfo, id, email};

            const updatedUser = await editReviewService(toEdit);

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
            logInfo.message = "Review updated successfully !";
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    message: "Review updated successfully !",
                    updatedUser: {
                        email: email,
                        updatedReview: updatedUser.updatedDocument.reviews[updatedUser.index]
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
