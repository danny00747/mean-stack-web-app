export default function makeListReviewsService({ reviewRepository }) {
    return async function listReviewsService() {
        return reviewRepository.findAll();
    }
}
