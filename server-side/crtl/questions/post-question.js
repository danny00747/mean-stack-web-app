export default function makePostQuestion ({ addQuestion }) {
  return async function postQuestion (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    };
    try {
      const { ...questionInfo } = httpRequest.body;
      const posted = await addQuestion({
        ...questionInfo,
      });
      return {
        headers,
        statusCode: 201,
        body: {
          message: "Created question successfully !",
          createdQuestion: {
            id: posted._id,
            name: posted.question,
            answer: posted.answers.find(x => x.isCorrect).option,
            request: {
              type: "POST",
              url: `http://localhost:5000/server/api/questions/${posted._id}`
            }
          }
        }
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
