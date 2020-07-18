import {getOneQuestionService} from '../../services/questions'
import {addLogService} from '../../services/logs'

export default function makeGetOneQuestionController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const doc = await getOneQuestionService({id: httpRequest.params.questionId});
            if (!doc) {

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
            logInfo.message = 'Request successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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
