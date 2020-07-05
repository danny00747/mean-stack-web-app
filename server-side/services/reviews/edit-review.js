import {makeReview} from '../../domain'

export default function makeEditReview({reviewDb}) {
    return async function editReview({id, email, ...changes} = {}) {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new Error(`${id} is not a valid ObjectId`);

        if (!email) throw new Error('You must supply the user email.');

        const existing = await reviewDb.findByEmail({email});

        if (!existing) return {message: "No user was found with provided Email"};

        const review = makeReview({...changes});
        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided ID!"};

        existing.reviews[index].rating = review.getRating();
        existing.reviews[index].reviewText = review.getReviewText();
        existing.reviews[index].updated = new Date();

        const updatedDocument = await reviewDb.save({
            id: existing._id,
            new: true,
            reviews: existing.reviews
        });

        return {index, updatedDocument}

        //const updatedUser = await usersDb.findById({id});

    }
}
