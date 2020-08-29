import {makeReview} from '../domain'

export default function reviewServiceFactory({reviewRepository}) {
    return Object.freeze({
        addReview, editReview, listReviews, removeReview
    });

    async function addReview({id, ...changes} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        const existing = await reviewRepository.findById({id});

        //  console.log(existing.reviews.id('5f00e562eead540b94458c06'));

        if (!existing) return {message: "No valid entry found for provided id !"};

        changes.author = existing.username;

        const review = makeReview({...changes});

        existing.reviews.push({
            author: review.getAuthor(),
            rating: review.getRating(),
            reviewText: review.getReviewText(),
            created: review.getCreatedOn(),
            updated: review.getModifiedOn(),
        });

        return reviewRepository.save({
            id: id,
            new: true,
            reviews: existing.reviews
        })
    }

    async function editReview({id, username, ...changes} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        if (!username) return {message: 'You must supply the username.'};

        const existing = await reviewRepository.findByUsername({username});

        if (!existing) return {message: "No user was found with provided username"};

        if (existing.reviews.length === 0)
            return {message: `${existing.username} doesn't have any reviews at the moment !`};

        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided id !"};

        changes.author = existing.username;

        const review = makeReview({...changes});

        existing.reviews[index].rating = review.getRating();
        existing.reviews[index].reviewText = review.getReviewText();
        existing.reviews[index].updated = new Date();

        const updatedDocument = await reviewRepository.save({
            id: existing._id,
            new: true,
            reviews: existing.reviews
        });

        return {index, updatedDocument}
    }

    async function listReviews() {
        return reviewRepository.findAll();
    }

    async function removeReview({id, username} = {}) {

        if (!id) return {message: 'You must supply an id.'};

        if (!(id.match(/^[0-9a-fA-F]{24}$/)))
            return {message: `${id} is not a valid ObjectId`};

        if (!username) return {message: 'You must supply a username.'};

        const existing = await reviewRepository.findByUsername({username});

        if (!existing) return {message: "No user was found with provided username !"};

        if (existing.reviews.length === 0)
            return {message: `${existing.username} doesn't have any reviews at the moment !`};

        //const reviewToEdit = existing.reviews.id(id);
        const index = existing.reviews.findIndex(i => (i._id).toString() === id);

        if (index === -1) return {message: "No was review found with provided id !"};

        existing.reviews.id(id).remove();

        const ancientDocument = await reviewRepository.save({
            id: existing._id,
            new: false,
            reviews: existing.reviews
        });

        return {index, ancientDocument}

    }
};
