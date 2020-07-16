export default function makeTokenRepository({Token}) {
    return Object.freeze({
        save
    });

    async function save({...tokenInfo}) {
        const token = new Token(tokenInfo);
        return await token.save();
    }

}

