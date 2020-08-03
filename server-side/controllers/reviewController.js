import {logService, reviewService} from "../services";

export default function reviewControllerFactory() {
    return Object.freeze({
        postReview, patchReview, getAllReviews, deleteReview
    });

    function logging(httpRequest) {
        return {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };
    }

    async function postReview(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;

            const updatedUser = await reviewService.addReview({id, ...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {...updatedUser,}}
            }

            logInfo.status = 201;
            logInfo.message = "Review created successfully !";
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

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

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }

    async function patchReview(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...userInfo} = httpRequest.body;
            const {reviewId: id, username} = httpRequest.params;

            const updatedUser = await reviewService.editReview(
                {id, username,...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = updatedUser.message;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {...updatedUser}}
            }

            logInfo.status = 200;
            logInfo.message = "Review updated successfully !";
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "Review updated successfully !",
                    updatedUser: {
                        username: username,
                        updatedReview: updatedUser.updatedDocument.reviews[updatedUser.index]
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function getAllReviews(httpRequest) {

        const logInfo = logging(httpRequest);

        try {

            const reviews = await reviewService.listReviews();

            if (reviews.length === 0) {

                logInfo.status = 404;
                logInfo.message = 'No user found in the database !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

                await logService.createLog({logInfo});

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

                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No user seems to have review(s) at the moment ."}
                }
            }

            logInfo.status = 200;
            logInfo.host = "devwebapp.herokuapp.com";
            logInfo.message = 'Request successful ! ';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

            await logService.createLog({logInfo});

            const data = [];
            reviews.forEach(x => x.reviews.forEach(y => data.push(y)));
            return {statusCode: 200, body: [...data]}
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;

            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function deleteReview(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {reviewId: id, username} = httpRequest.params;

            const updatedUser = await reviewService.removeReview(
                {id, username});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = updatedUser.message;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {...updatedUser}}
            }

            logInfo.status = 200;
            logInfo.message = 'Review deleted successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "Review deleted successfully !",
                    updatedUser: {
                        username: username,
                        removedReview: updatedUser.ancientDocument.reviews[updatedUser.index]
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

};
