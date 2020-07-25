import {makeReview} from '../../domain'

export default function makeEditReviewService({reviewRepository}) {
    return async ({id, email, ...changes} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        if (!email) throw new Error('You must supply the user email.');

        if (!(email.match(/^[aA-zZ0-9._%+-]+@[a-z0-9.-]+\.[aA-zZ]{2,4}$/)))
            throw new SyntaxError(`${email} is not a valid email`);

        const review = makeReview({...changes});

        const existing = await reviewRepository.findByEmail({email});

        if (!existing) return {message: "No user was found with provided email"};

        if (existing.reviews.length === 0) return {
            message: `${existing.username} doesn't have any reviews at the moment !`};

        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided id !"};

        existing.reviews[index].rating = review.getRating();
        existing.reviews[index].reviewText = review.getReviewText();
        existing.reviews[index].updated = new Date();

        const updatedDocument = await reviewRepository.save({
            id: existing._id,
            new: true,
            reviews: existing.reviews
        });

        return {index, updatedDocument}

        //const updatedUser = await usersDb.findById({id});

    }
}
