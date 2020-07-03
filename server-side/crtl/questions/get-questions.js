export default function makeGetQuestions ({ listQuestions }) {
  return async function getQuestions () {
    const headers = {
      'Content-Type': 'application/json'
    };
    try {
      const questions = await listQuestions();

      if (questions.length === 0){
        return {
          headers,
          statusCode: 204,
          body: {message: "No documents found in the database"}
        }
      }
      return {
        headers,
        statusCode: 200,
        body: questions
      }
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
