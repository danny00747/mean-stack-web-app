export default function makeRemoveReview({reviewDb}) {
    return async function removeReview({id, email} = {}) {

        if (!id) throw new Error('You must supply an id.');

        if (!(id.match(/^[0-9a-fA-F]{24}$/))) throw new Error(`${id} is not a valid ObjectId`);

        if (!email) throw new Error('You must supply the user email.');

        const existing = await reviewDb.findByEmail({email});

        if (!existing) return {message: "No user was found with provided Email"};

        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided ID!"};

        existing.reviews.splice();

        existing.reviews.id(id).remove();

        const ancientDocument = await reviewDb.save({
            id: existing._id,
            new: false,
            reviews: existing.reviews
        });

        return {index, ancientDocument}

        //const updatedUser = await usersDb.findById({id});

    }
}
