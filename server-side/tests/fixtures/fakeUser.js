export default function makeFakeUser (overrides) {
    const randomUser = Math.random().toString(36).substr(2, 9);
    const user = {
        username: randomUser,
        email: `${randomUser}@gmail.com`,
        password: "toto"
    };

    return {
        ...user,
        ...overrides
    }
}
