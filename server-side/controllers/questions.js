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

            if (docs.length === 0)
                return [res
                    .status(204)
                    .json({message: "No documents found in the database"}),
                    logs.updateLog('info', req, 'Outgoing', res)];

            docs.forEach(x => response.push(x));
            res.status(200).json(response);
            logs.updateLog('info', req, 'Outgoing', res);
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
            logs.updateLog('error', req, 'Outgoing', res);
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
                res
                    .status(200)
                    .json(new Array({
                        id: doc._id,
                        type: doc.type,
                        question: doc.question,
                        answers: doc.answers,
                        request: {
                            type: "GET",
                            url: `http://localhost:5000/api/questions/${doc._id}`
                        }
                    }));
                logs.updateLog('info', req, 'Outgoing', res);
            } else {
                res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
                logs.updateLog('info', req, 'Outgoing', res);
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    errorMessage: err.message,
                    errorName: err.name
                });
            logs.updateLog('error', req, 'Outgoing', res);
        });
};

const question_update_one = (req, res) => {
    const {questionId} = req.params;
    const userInfo = ["type", "question", "answers"];
    const reqBodyLength = Object.keys(req.body).length;
    const checkValues = Object.keys(req.body).filter(x => (userInfo.includes(x))).length;

    if ((Object.keys(req.body).length > 3) || (reqBodyLength !== checkValues)) {
        return res
            .status(405)
            .json({
                message: "Some fields are NOT allowed"
            });
    }

    Question.updateOne({_id: questionId}, {$set: req.body})
        .exec()
        .then(result => {
            if (result.n === 0) {
                return res
                    .status(404)
                    .json({message: "No valid entry found for provided ID"});
            } else {
                res.status(200).json({
                    message: "Question updated successfully !",
                    modifiedDocs: result.nModified,
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/api/questions/${questionId}`
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
        });
};

const questionCreate = (req, res) => {

    const question = new Question(req.body);
    question
        .save()
        .then(result => {
            if (!result) {
                res.status(405).json({
                    message: "Invalid input"
                });
            } else {
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
                                url: `http://localhost:5000/api/questions/${result._id}`
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
        });
};

const question_delete_one = (req, res) => {
    const {questionId} = req.params;
    Question.findByIdAndRemove(questionId)
        .exec()
        .then((doc) => {
            if (doc === null) return res
                .status(404)
                .json({message: "No valid entry found for provided ID"});

            res.status(200).json({
                message: "Question deleted successfully !",
                request: {
                    type: "POST",
                    url: "http://localhost:5000/api/questions",
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
            res
                .status(404)
                .json({message: "An error occured while trying to delete this question"});
        });
};

module.exports = {
    questionCreate,
    question_get_all,
    question_get_one,
    question_update_one,
    question_delete_one
};
