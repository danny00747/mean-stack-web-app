import {makeUser} from '../../domain'
export default function makeAdduser ({ usersDb }) {
  return async function addUser (userInfo) {

    const existing = await usersDb.findByEmailOrUsername(userInfo.email, userInfo.username);

    if (existing.length !== 0) {
      return {message : "A user with the same username or email already exists !"}
    }

    const user = makeUser(userInfo);
    return usersDb.save({
      username: user.getUsername(),
      email: user.getEmail(),
      password: user.getPassword(),
      reviews: user.getReviews(),
      role: user.getRole(),
      score: user.getscore(),
    })
  }
}
