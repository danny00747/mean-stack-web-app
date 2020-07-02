const Question = require("./questionModel");
export default function makeQuestionDb ({ Question }) {
  return Object.freeze({
    save
  });
  async function save({...commentInfo}) {
    const db = new Question(commentInfo);
    return await db.save();
  }
}
