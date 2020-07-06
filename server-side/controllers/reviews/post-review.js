export default function makePostReviewController({addReviewService}) {
    return async (httpRequest) => {

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;
            const toEdit = {...userInfo, id};

            const updatedUser = await addReviewService(toEdit);

            if (updatedUser.message) {
                return {
                    statusCode: 404,
                    body: {
                        ...updatedUser,
                    }
                }
            }

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
