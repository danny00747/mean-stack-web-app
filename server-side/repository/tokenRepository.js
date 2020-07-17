export default function makeTokenRepository({Token}) {
    return Object.freeze({
        save, findKey
    });

    async function save({...tokenInfo}) {
        const token = new Token(tokenInfo);
        return await token.save();
    }

    async function findKey({key: randomKey}) {
        return await Token.findOne({randomKey})
            .select("-__v")
            .exec();
    }

}

