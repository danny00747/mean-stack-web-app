export default function makePatchQuestionController({editQuestionService}) {
    return async (httpRequest) => {

        try {
            const {...questionInfo} = httpRequest.body;
            const {questionId: id} = httpRequest.params;
            const toEdit = {
                ...questionInfo,
                id: httpRequest.params.questionId
            };
            const updatedQuestion = await editQuestionService(toEdit);

            if (!updatedQuestion) {
                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                statusCode: 200,
                body: {
                    message: "Question updated successfully !",
                    updatedQuestion: {
                        question: updatedQuestion.question
                    },
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/server/api/questions/${id}`
                    }
                }
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e);
            if (e.name === 'RangeError') {
                return {
                    statusCode: 404,
                    body: {
                        error: e.message
                    }
                }
            }
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
