import {logService,questionService} from "../services";

export default function questionControllerFactory() {
    return Object.freeze({
        postQuestion, patchQuestion, getAllQuestions,
        getQuestion, deleteQuestion
    });

    function logging(httpRequest) {
        return {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };
    }

    async function postQuestion(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...questionInfo} = httpRequest.body;
            const posted = await questionService.addQuestion({...questionInfo});

            logInfo.status = 201;
            logInfo.message = 'Created question successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});
            return {
                statusCode: 201,
                body: {
                    message: "Created question successfully !",
                    createdQuestion: {
                        id: posted._id,
                        question: posted.question,
                        answer: posted.answers.find(x => x.isCorrect).option
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);

            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function patchQuestion(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...questionInfo} = httpRequest.body;
            const {questionId: id} = httpRequest.params;

            const updatedQuestion = 
                await questionService.editQuestion({id,...questionInfo});

            if (!updatedQuestion) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Question updated successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {

                statusCode: 200,
                body: {
                    message: "Question updated successfully !",
                    updatedQuestion: {
                        type: updatedQuestion.type,
                        question: updatedQuestion.question
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }
    
    async function getAllQuestions(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const questions = await questionService.listQuestions();

            if (questions.length === 0) {

                logInfo.status = 204;
                logInfo.message = 'No documents found in the database !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 204,
                    body: {message: "No documents found in the database !"}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Request successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {statusCode: 200, body: questions}
            
        } catch (e) {
          
            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }
    
    async function getQuestion(httpRequest) {

        const logInfo = logging(httpRequest);

        const {questionId: qstId} = httpRequest.params;

        try {
            const question =
                await questionService.getQuestion({id: qstId});
            if (!question) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Request successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: new Array({
                    id: question._id,
                    type: question.type,
                    question: question.question,
                    answers: question.answers,

                })
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function deleteQuestion(httpRequest) {

        const logInfo = logging(httpRequest);

        const {questionId: qstId} = httpRequest.params;

        try {
            const deleted =
                await questionService.removeQuestion({id : qstId});
            if (!deleted) {

                logInfo.status = 404;
                logInfo.message = 'No valid entry found for provided id .';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id ."}
                }
            }

            logInfo.status = 200;
            logInfo.message = 'Question deleted successfully !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "Question deleted successfully !",
                    deletedQuestion: deleted.question
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }
}
