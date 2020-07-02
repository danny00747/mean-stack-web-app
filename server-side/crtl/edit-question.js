export default function makePatchQuestion({editQuestion}) {
    return async function patchQuestion(httpRequest) {
        try {
            const {...commentInfo} = httpRequest.body;
            const {questionId: id} = httpRequest.params;
            const toEdit = {
                ...commentInfo,
                id: httpRequest.params.questionId
            };
            const patched = await editQuestion(toEdit);

            if (patched.n === 0) {
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 404,
                    body: {message: "No valid entry found for provided ID"}
                }
            }
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 200,
                body: {
                    message: "Question updated successfully !",
                    modifiedDocs: patched.nModified,
                    request: {
                        type: "GET",
                        url: `http://localhost:5000/server/api/questions/${id}`
                    }
                }
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e)
            if (e.name === 'RangeError') {
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 404,
                    body: {
                        error: e.message
                    }
                }
            }
            return {
                headers: {
                    'Content-Type': 'application/json'
                },
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
