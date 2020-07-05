export default function makeUserRepository({User}) {
    return Object.freeze({
        save, findByEmailOrUsername, findPseudo, findAll, findById, patch, remove
    });

    async function save({...userInfo}) {
        const db = new User(userInfo);
        return await db.save();
    }

    async function findAll() {
        return await User.find()
            .select("-__v")
            .exec();
    }

    async function findById({id: _id}) {
        return await User.findById({_id})
            .select("_id email role username level password")
            .exec();

    }

    async function patch({id: _id, ...userInfo}) {
        return await User.findByIdAndUpdate({_id}, {...userInfo}, {new: true}).exec();
    }

    async function findByEmailOrUsername(email, username) {
        return await User.find({
            $or: [{email: email}, {username: username}]
        })
            .exec();
    }

    async function findPseudo(pseudo) {
        return await User.find({
            $or: [
                {email: pseudo}, {username: pseudo}
            ]
        })
            .exec();
    }

    async function remove({ id: _id }) {
        return await User.findByIdAndRemove({ _id }).exec();
    }


}

