export default function makeUserDb({User}) {
    return Object.freeze({
        save, findByEmailOrUsername
    });

    async function save({...userInfo}) {
        const db = new User(userInfo);
        return await db.save();
    }

    async function findByEmailOrUsername(email, username){
        return await User.find({
            $or: [
                {email: email}, {username: username}
            ]
        })
            .exec();
    }
}

