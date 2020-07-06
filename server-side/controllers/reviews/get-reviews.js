export default function makeGetReviewsController({getAllReviewsService}) {
    return async () => {

        try {
            const reviews = await getAllReviewsService();

            if (reviews.length === 0) {
                return {
                    statusCode: 404,
                    body: {message: "No user found in the database !"}
                }
            }

            const reviewCount = reviews.filter(x => x.reviews.length !== 0).length;

            if (reviewCount === 0) {
                return {
                    statusCode: 404,
                    body: {message: "No user seems to have review(s) at the moment ."}
                }
            }

            const data = [];
            reviews.forEach(x => x.reviews.forEach(y => data.push(y)));
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
