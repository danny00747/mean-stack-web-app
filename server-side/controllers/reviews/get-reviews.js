export default function makeGetReviewsController({getAllReviewsService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: `info`, requestId: httpRequest.id, ip : httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {

            const reviews = await getAllReviewsService();

            if (reviews.length === 0) {

                logInfo.status = 404;
                logInfo.message = 'No user found in the database !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No user found in the database !"}
                }
            }

            const reviewCount = reviews.filter(x => x.reviews.length !== 0).length;

            if (reviewCount === 0) {

                logInfo.status = 404;
                logInfo.message = 'No user seems to have review(s) at the moment .';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No user seems to have review(s) at the moment ."}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Request successful ! ';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

            await addLogService(logInfo);

            const data = [];
            reviews.forEach(x => x.reviews.forEach(y => data.push(y)));
            return {
                statusCode: 200,
                body: [...data]
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
