const Question = require("../models/questions");
const logs = require("./logs");
const {success, info, error, debug} = require('consola');

const question_get_all = async (req, res) => {

   await logs.saveLog('info', req, 'Incoming');

    let response = [];
    Question.find()
        .select("question answers _id type")
        .exec()
        .then(docs => {

            if (docs.length === 0){
                logs.updateLog('info', req, 'Outgoing', 204);
                return res
                    .status(204)
                    .json({message: "No documents found in the database"});
            } else {
                docs.forEach(x => response.push(x));
                logs.updateLog('info', req, 'Outgoing', 200);
              return res.status(200).json(response);
            }


        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
            logs.updateLog('error', req, 'Outgoing', 500);
        });
};

const question_get_one = async (req, res) => {

    await logs.saveLog('info', req, 'Incoming');

    const {questionId} = req.params;
    Question.findById(questionId)
        .select("question answers _id")
        .exec()
        .then(doc => {
            if (doc) {
                logs.updateLog('info', req, 'Outgoing', 200);
                res
                    .status(200)
                    .json(new Array({
                        id: doc._id,
                        type: doc.type,
                        question: doc.question,
                        answers: doc.answers,
                        request: {
                            type: "GET",
                            url: `http://localhost:5000/server/api/questions/${doc._id}`
                        }
                    }));
            } else {
                logs.updateLog('info', req, 'Outgoing', 404);
                res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
            logs.updateLog('error', req, 'Outgoing', 500);
        });
};

const question_update_one = async (req, res) => {

    await logs.saveLog('info', req, 'Incoming');

    const {questionId} = req.params;
    const userInfo = ["type", "question", "answers"];
    const reqBodyLength = Object.keys(req.body).length;
    const checkValues = Object.keys(req.body).filter(x => (userInfo.includes(x))).length;

    if ((Object.keys(req.body).length > 3) || (reqBodyLength !== checkValues)) {
        return [res
            .status(405)
            .json({
                message: "Some fields are NOT allowed"
            }),
        logs.updateLog('info', req, 'Outgoing', 405)];
    }

    Question.updateOne({_id: questionId}, {$set: req.body})
        .exec()
        .then(result => {
            if (result.n === 0) {
                return [res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"}),
                    logs.updateLog('info', req, 'Outgoing', 404)];
            } else {
                logs.updateLog('info', req, 'Outgoing', 200);
                res.status(200).json({
                    message: "Question updated successfully !",
                    modifiedDocs: result.nModified,
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/server/api/questions/${questionId}`
                    }
                });
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
            logs.updateLog('error', req, 'Outgoing', 500);
        });
};

const questionCreate = async (req, res) => {

    await logs.saveLog('info', req, 'Incoming');

    const question = new Question(req.body);
    question
        .save()
        .then(result => {
            if (!result) {
                logs.updateLog('info', req, 'Outgoing', 405);
                res.status(405).json({
                    message: "Invalid input"
                });
            } else {
                logs.updateLog('info', req, 'Outgoing', 201);
                res
                    .status(201)
                    .json({
                        message: "Created question successfully !",
                        createdQuestion: {
                            id: result._id,
                            name: result.question,
                            answer: result.answers.filter(x => x.isCorrect === "true")[0].option,
                            request: {
                                type: "GET",
                                url: `http://localhost:5000/server/api/questions/${result._id}`
                            }
                        }
                    });
            }
        })
        .catch(err => {
            res
                .status(405)
                .json({
                    message: "Invalid input",
                    error: err
                });
            logs.updateLog('error', req, 'Outgoing', 500);
        });
};

const question_delete_one = async (req, res) => {

    await logs.saveLog('info', req, 'Incoming');

    const {questionId} = req.params;
    Question.findByIdAndRemove(questionId)
        .exec()
        .then((doc) => {
            if (doc === null) {
                logs.updateLog('info', req, 'Outgoing', 404);
                return res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
            }

            logs.updateLog('info', req, 'Outgoing', 200);
            res.status(200).json({
                message: "Question deleted successfully !",
                request: {
                    type: "POST",
                    url: "http://localhost:5000/server/api/questions",
                    body: {
                        question: "String",
                        answers: {
                            option: "String",
                            isCorrect: "Boolean",
                        }
                    }
                }
            });
        })
        .catch(err => {
            logs.updateLog('error', req, 'Outgoing', 500);
            res
                .status(500)
                .json({message:
                        "An error occured while trying to delete this question"});
        });
};

module.exports = {
    questionCreate,
    question_get_all,
    question_get_one,
    question_update_one,
    question_delete_one
};
