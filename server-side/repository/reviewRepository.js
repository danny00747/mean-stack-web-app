export default function makeReviewRepository({User}) {
    return Object.freeze({
        findById, save, findAll, findByUsername
    });

    async function findById({id: _id}) {
        return await User.findById({_id})
            .select("_id email username reviews")
            .exec();
    }

    async function findByUsername({username: username}) {
        return await User.findOne({username})
            .select("_id username email reviews")
            .exec();
    }

    async function findAll() {

       // const t = await User.aggregate([{$project: {count: {$size: "$reviews"}}}]);

        return await User.find()
            .select("reviews -_id")
            .exec();
    }

    async function save({id: _id, new: bool, ...userInfo}) {
        return await User.findByIdAndUpdate({_id}, {...userInfo}, {new: bool}).exec();
    }

}

