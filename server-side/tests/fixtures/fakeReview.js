export default function makeFakeReview (overrides) {

    const review = {
        rating: 3,
        reviewText: 'I think, therefore I am'
    };

    return {
        ...review,
        ...overrides
    }
}
