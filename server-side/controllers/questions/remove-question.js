import {removeQuestionService} from '../../services/questions'
import {addLogService} from '../../services/logs'

export default function makeDeleteQuestionController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const deleted = await removeQuestionService({id: httpRequest.params.questionId});
            if (!deleted) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id .';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id ."}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Question deleted successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

            return {
                statusCode: 200,
                body: {
                    message: "Question deleted successfully !",
                    deletedQuestion: deleted.question
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
