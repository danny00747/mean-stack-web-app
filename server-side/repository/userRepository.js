export default function makeUserRepository({User}) {
    return Object.freeze({
        save, findByEmailOrUsername, findPseudo,
        findAll, findById, patch, remove, findByEmail
    });

    async function save({...userInfo}) {
        const user = new User(userInfo);
        return await user.save();
    }

    async function findAll() {
        return await User.find()
            .select("-__v -password -reviews")
            .exec();
    }

    async function findById({id: _id}) {
        return await User.findById({_id})
            .select("_id email role username level password reviews isVerified")
            .exec();

    }

    async function findByEmail({email: email}) {
        return await User.findOne({email})
            .select("_id username email isVerified")
            .exec();
    }

    async function patch({id: _id, ...userInfo}) {
        return await User.findByIdAndUpdate({_id}, {...userInfo}, {new: true})
            .select("-__v")
            .exec();
    }

    async function findByEmailOrUsername({email: email, username: username}) {
        return await User.find({
            $or: [{email: email}, {username: username}]
        })
            .exec();
    }

    async function findPseudo({pseudo}) {
        return await User.findOne({
            $or: [
                {email: pseudo}, {username: pseudo}
            ]
        })
            .exec();
    }

    async function remove({id: _id}) {
        return await User.findByIdAndRemove({_id}).exec();
    }

}

