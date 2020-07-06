export default function buildMakeReview(requiredParameter) {
    return ({
                rating = 0, reviewText = requiredParameter('The reviewText field'),
                createdOn = new Date(), modifiedOn = new Date()
            } = {}) => {

        if (rating < 0 || rating > 5) throw new RangeError('The rating must be between 0 and 5 .');

        if (typeof reviewText !== 'string') throw new TypeError('reviewText must be a string.');

        if (typeof rating !== 'string') throw new TypeError('rating must be a string.');

        return Object.freeze({
            getRating: () => rating,
            getReviewText: () => reviewText,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn
        });
    }
}
