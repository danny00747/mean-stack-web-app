export default function makeReviewRepository({User}) {
    return Object.freeze({
        findById, save, findAll, findByEmail, removeReview
    });

    async function findById({id: _id}) {
        return await User.findById({_id})
            .select("_id email reviews")
            .exec();
    }

    async function findByEmail({email: email}) {
        return await User.findOne({email})
            .select("_id email reviews")
            .exec();
    }

    async function findAll() {
        return await User.find()
            .select("reviews -_id")
            .exec();
    }

    async function save({id: _id, new: bool, ...userInfo}) {
        return await User.findByIdAndUpdate({_id}, {...userInfo}, {new: bool}).exec();
    }

    async function removeReview({id: _id, new: bool, ...userInfo}) {
        return await User.findByIdAndUpdate({_id}, {...userInfo}, {new: bool}).exec();
    }

}

