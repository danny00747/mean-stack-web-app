export default function makeFakeQuestion (overrides) {
    const question = {
        "type" : "boolean",
        "question" : "is 25 - 20 equal to 150 ?",
        "answers": [{"option": "false", "isCorrect": true},
            {"option": "true", "isCorrect": false}]
    };

    return {
        ...question,
        ...overrides
    }
}
