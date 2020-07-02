export default function makePostQuestion ({ addQuestion }) {
  return async function postQuestion (httpRequest) {
    try {
      const { source = {}, ...questionInfo } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer']
      }
      const posted = await addQuestion({
        ...questionInfo,
        source
      });
      return {
        headers: {
          'Content-Type': 'application/json'
        },
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
        headers: {
          'Content-Type': 'application/json'
        },
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
