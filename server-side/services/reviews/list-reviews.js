export default function makeListReviews({ reviewDb }) {
    return async function listReviews() {
        return reviewDb.findAll();
    }
}
