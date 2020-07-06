export default function makePostQuestionController({addQuestionService}) {
    return async (httpRequest) => {

        try {
            const {...questionInfo} = httpRequest.body;
            const posted = await addQuestionService({
                ...questionInfo,
            });

            return {
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
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
