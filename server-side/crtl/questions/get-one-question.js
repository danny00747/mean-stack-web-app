export default function makeGetOneQuestion({getOneQuestion}) {
    return async function getQuestion(httpRequest) {

        try {
            const doc = await getOneQuestion({id: httpRequest.params.questionId});
            if (!doc) {
                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                statusCode: 200,
                body: new Array({
                    id: doc._id,
                    type: doc.type,
                    question: doc.question,
                    answers: doc.answers,
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/server/api/questions/${doc._id}`
                    }
                })
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e);
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
