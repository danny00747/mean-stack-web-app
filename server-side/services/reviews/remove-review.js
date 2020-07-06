export default function makeRemoveReviewService({reviewRepository}) {
    return async ({id, email} = {}) => {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new TypeError(`${id} is not a valid ObjectId`);

        if (!email) throw new Error('You must supply the user email.');

        const existing = await reviewRepository.findByEmail({email});

        console.log(existing);

        if (!existing) return {message: "No user was found with provided email !"};

        if (existing.reviews.length === 0)
            return {message: `${existing.username} doesn't have any reviews at the moment !`};

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
