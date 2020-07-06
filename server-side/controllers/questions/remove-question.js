export default function makeDeleteQuestionController({removeQuestionService}) {
    return async (httpRequest) => {

        try {
            const deleted = await removeQuestionService({id: httpRequest.params.questionId});
            if (!deleted) {
                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                statusCode: 200,
                body: {
                    message: "Question deleted successfully !",
                    deletedQuestion: deleted.question
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
