export default function buildMakeReview(requiredParameter) {
    return ({
                author = requiredParameter('The author'), rating = 0,
                reviewText = requiredParameter('The reviewText field'), createdOn = new Date(),
                modifiedOn = new Date()
            } = {}) => {

        if (typeof author !== 'string') throw new TypeError('The author must be a string.');

        if (author.length < 4 || author.length >= 12)
            throw new RangeError('An author length must be between 4 and 12.');

        if (typeof rating !== 'number') throw new TypeError('rating must be a number.');

        if (rating < 0 || rating > 5) throw new RangeError('The rating must be between 0 and 5 .');

        if (typeof reviewText !== 'string') throw new TypeError('reviewText must be a string.');

        return Object.freeze({
            getAuthor: () => author,
            getRating: () => rating,
            getReviewText: () => reviewText,
            getCreatedOn: () => createdOn,
            getModifiedOn: () => modifiedOn
        });
    }
}
