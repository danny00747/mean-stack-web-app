export default function makeGetQuestionsController({listQuestionsService}) {
    return async () => {

        try {
            const questions = await listQuestionsService();

            if (questions.length === 0) {
                return {
                    statusCode: 204,
                    body: {message: "No documents found in the database"}
                }
            }
            return {
                statusCode: 200,
                body: questions
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
