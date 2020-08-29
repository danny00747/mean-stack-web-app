export default function makeFakeReview(overrides) {

    const review = {
        author: 'toto',
        rating: 3,
        reviewText: 'I think, therefore I am'
    };

    return {
        ...review,
        ...overrides
    }
}
