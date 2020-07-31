export default function makeRandomKeyFactory({crypto}) {
    return Object.freeze({
        generateKey
    });

    function  generateKey() {
        return crypto.randomBytes(32).toString('hex')
    }
}
