export default function makeListReviewsService({reviewRepository}) {
    return async () => {
        return reviewRepository.findAll();
    }
}
