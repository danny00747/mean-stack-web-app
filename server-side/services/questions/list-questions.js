export default function makeListQuestionService({questionRepository}) {
    return async () => {
        return questionRepository.findAll();
    }
}
