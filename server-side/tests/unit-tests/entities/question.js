import {describe, it} from "mocha";
import makeFakeQuestion from "../../fixtures/fakeQuestion";
import {makeQuestion} from "../../../domain";
import {expect} from "chai";
import {RequiredParameterError} from "../../../helpers/errors";

describe('QUESTION ENTITY', () => {

    describe('#question', () => {

        it('it should make a question', () => {
            const question = makeFakeQuestion();
            const buildQuestion = makeQuestion({...question});
            expect(buildQuestion.getType()).to.be.eql(question.type);
            expect(buildQuestion.getQuestion()).to.be.eql(question.question);
            expect(buildQuestion.getAnswers()).to.have.deep.members(question.answers);
        });
    });

    describe('#type', () => {

        it('a question must have a type', () => {
            const question = makeFakeQuestion({type: undefined});
            expect(() => makeQuestion({...question}))
                .to.throw(RequiredParameterError, 'A type is a required.');
        });

        it("a question's type must be a string", () => {
            const question = makeFakeQuestion({type: 8});
            expect(() => makeQuestion({...question}))
                .to.throw(TypeError, 'The type must be a string.');
        });

        it("can only accept allowed question types", () => {
            const question = makeFakeQuestion({type: "abc"});
            expect(() => makeQuestion({...question}))
                .to.throw(RangeError, 'These are the types are allowed : boolean, multiple, fill in');
        });
    });

    describe('#question', () => {

        it('a question must have a question field a type', () => {
            const question = makeFakeQuestion({question: undefined});
            expect(() => makeQuestion({...question}))
                .to.throw(RequiredParameterError, 'A question is a required.');
        });

        it("a question must be a string", () => {
            const question = makeFakeQuestion({question: 8});
            expect(() => makeQuestion({...question}))
                .to.throw(TypeError, 'A question must be a string required.');
        });
    });

    describe('#answers', () => {

        it('a question must have a answers', () => {
            const question = makeFakeQuestion({answers: undefined});
            expect(() => makeQuestion({...question}))
                .to.throw(RequiredParameterError, "The question's answer is a required.");
        });

        it("The question's answer must be an array", () => {
            const question = makeFakeQuestion({answers: "abc"});
            expect(() => makeQuestion({...question}))
                .to.throw(TypeError, "The question's answer must be an array");
        });

        it("Each answer must have an option", () => {
            const question = makeFakeQuestion();
            question.answers[0].option = undefined;
            expect(() => makeQuestion({...question}))
                .to.throw(Error, 'Each answer must have an option');
        });

        it("Each answer must have the isCorrect field", () => {
            const question = makeFakeQuestion();
            question.answers[0].isCorrect = undefined;
            expect(() => makeQuestion({...question}))
                .to.throw(Error, 'Each answer must have the isCorrect field');
        });

        it("accept only allowed fields", () => {
            const question = makeFakeQuestion();
            question.answers[0].name = 'toto';
            expect(() => makeQuestion({...question}))
                .to.throw(Error, 'Some fields are not allowed !');
        });
    });
});
