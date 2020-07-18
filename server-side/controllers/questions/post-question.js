import {addQuestionService} from '../../services/questions'
import {addLogService} from '../../services/logs'

export default function makePostQuestionController() {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...questionInfo} = httpRequest.body;
            const posted = await addQuestionService({...questionInfo});

            logInfo.status = 201;
            logInfo.message = 'Created question successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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
