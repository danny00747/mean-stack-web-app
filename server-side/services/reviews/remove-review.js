export default function makeRemoveReviewService({reviewRepository}) {
    return async ({id, email} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        if (!email) throw new Error('You must supply the user email.');

        const existing = await reviewRepository.findByEmail({email});

        if (!existing) return {message: "No user was found with provided Email"};

        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided id!"};

        existing.reviews.id(id).remove();

        const ancientDocument = await reviewRepository.save({
            id: existing._id,
            new: false,
            reviews: existing.reviews
        });

        return {index, ancientDocument}

    }
}
