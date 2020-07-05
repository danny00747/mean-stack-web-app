export default function buildMakeReview() {
    return function makeReview({
                                   rating = 0, reviewText, createdOn = new Date(),
                                   modifiedOn = new Date(),
                               } = {}) {

        if (!reviewText) throw new Error('A reviewText is a required.');

        if (rating < 0 || rating > 5) throw new Error('The minimum rating is 0 and max is 5 .');

        if (typeof reviewText !== 'string') throw new Error('reviewText must be a string.');

        if (typeof rating !== 'string') throw new Error('rating must be a string.');

        return Object.freeze({
            getRating: () => rating,
            getReviewText: () => reviewText,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn
        });
    }
}
