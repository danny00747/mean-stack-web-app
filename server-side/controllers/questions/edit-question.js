export default function makePatchQuestionController({editQuestionService, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...questionInfo} = httpRequest.body;
            const {questionId: id} = httpRequest.params;
            const toEdit = {
                ...questionInfo,
                id: httpRequest.params.questionId
            };
            const updatedQuestion = await editQuestionService(toEdit);

            if (!updatedQuestion) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Question updated successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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
