export default function makeGetReviewsController({getAllReviewsService, addLogService, editLogService}) {
    return async (httpRequest) => {

        try {

            const logInfo = {
                level: `info`,
                type: `Incoming`,
                message: `Incoming ${httpRequest.method} request to ${httpRequest.url}`,
                url: httpRequest.url,
                host: httpRequest.host,
                method: httpRequest.method,
                requestId: httpRequest.id,
            };

            await addLogService(logInfo);

            const reviews = await getAllReviewsService();

            if (reviews.length === 0) {
                return {
                    statusCode: 404,
                    body: {message: "No user found in the database !"}
                }
            }

            const reviewCount = reviews.filter(x => x.reviews.length !== 0).length;

            if (reviewCount === 0) {
                logInfo.status = 404;
                logInfo.response =
                    `Outgoing ${httpRequest.method} request to ${httpRequest.url}`;

                await editLogService(logInfo);
                return {
                    statusCode: 404,
                    body: {message: "No user seems to have review(s) at the moment ."}
                }
            }


            logInfo.status = 200;
            logInfo.response =
                `Outgoing ${httpRequest.method} request to ${httpRequest.url}`;

            await editLogService(logInfo);

            const data = [];
            reviews.forEach(x => x.reviews.forEach(y => data.push(y)));
            console.log(httpRequest.id, "*****", httpRequest.host, "outing going ok request for all reviews");
            return {
                statusCode: 200,
                body: [...data]
            }
        } catch (e) {
            // TODO: Error logging
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
