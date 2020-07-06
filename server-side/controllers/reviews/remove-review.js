export default function makeDeleteReviewController({removeReviewService}) {
    return async (httpRequest) => {

        try {
            const {reviewId: id, userEmail: email} = httpRequest.params;

            const updatedUser = await removeReviewService({id, email});

            if (updatedUser.message) {
                return {
                    statusCode: 404,
                    body: {
                        ...updatedUser,
                    }
                }
            }

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
