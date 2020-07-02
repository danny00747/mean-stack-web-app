export default function makeDeleteQuestion ({ removeQuestion }) {
    return async function deleteQuestion (httpRequest) {
        const headers = {
            'Content-Type': 'application/json'
        };
        try {
            const deleted = await removeQuestion({ id: httpRequest.params.questionId });
            if(!deleted){
                return {
                    headers,
                    statusCode : 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                headers,
                statusCode : 200,
                body: {
                    message: "Question deleted successfully !",
                    deletedQuestion : deleted.question
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
