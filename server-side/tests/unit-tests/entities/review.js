//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import {expect} from 'chai';
import {describe, it} from 'mocha';

import makeFakeReview from '../../fixtures/fakeReview'
import {makeReview} from '../../../domain'
import {RequiredParameterError} from "../../../helpers/errors"

describe('REVIEW ENTITY', () => {

    describe('#review', () => {

        it('it should make a review', () => {
            const review = makeFakeReview();
            const buildReview = makeReview({...review});
            expect(buildReview.getRating()).to.be.eql(review.rating);
            expect(buildReview.getReviewText()).to.be.eql(review.reviewText);
        });
    });

    describe('#rating', () => {

        it('rating must be a number', () => {
            const review = makeFakeReview({rating: "abc"});
            expect(() => makeReview({...review}))
                .to.throw(TypeError, 'rating must be a number.');
        });

        it('the minimum rating must be 0', () => {
            const review = makeFakeReview({rating: -8});
            expect(() => makeReview({...review}))
                .to.throw(RangeError, 'The rating must be between 0 and 5 .');
        });

        it('the maximum rating must be 5', () => {
            const review = makeFakeReview({rating: 8});
            expect(() => makeReview({...review}))
                .to.throw(RangeError, 'The rating must be between 0 and 5 .');
        });
    });

    describe('#reviewText', () => {

        it('a review must have a reviewText', () => {
            const review = makeFakeReview({reviewText: undefined});
            expect(() => makeReview({...review}))
                .to.throw(RequiredParameterError, 'The reviewText field is a required.');
        });

        it('reviewText must be a string', () => {
            const review = makeFakeReview({reviewText: 8});
            expect(() => makeReview({...review}))
                .to.throw(TypeError, 'reviewText must be a string.');
        });

        it("reviewText can't be null", () => {
            const review = makeFakeReview({reviewText: null});
            expect(() => makeReview({...review}))
                .to.throw(TypeError, 'reviewText must be a string.');
        });
    });
});
