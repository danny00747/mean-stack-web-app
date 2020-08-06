//During the test the env variable is set to test
import makeFakeUser from "../../fixtures/fakeUser";

process.env.NODE_ENV = 'test';

//import server to bring in everything together
import server from "../../../../app";

//bring in dev-dependencies
import chai, {assert, should, expect} from 'chai';
import {describe, before, it, after} from 'mocha';

import makeFakeReview from '../../fixtures/fakeReview'
import env from '../../../config/environment'
import {reviewService, userService} from "../../../services"
import {userRepository, reviewRepository} from '../../../repository'

describe('REVIEW SERVICE', () => {

    after(async () => {
        await reviewRepository.save({
            id: env.ADMIN_ID, new: true, reviews: [
                {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
        });
    });


    describe('#add-review', () => {

        it('inserts a review in the database', async () => {

            await reviewRepository.save({
                id: env.ADMIN_ID, new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const inserted = await reviewService.addReview(
                {id: env.ADMIN_ID, ...newReview});

            expect(inserted.reviews).not.to.be.empty;
            expect(inserted.reviews[0]).to.have.property('rating')
                .that.eqls(newReview.rating);
            expect(inserted.reviews[0]).to.have.property('reviewText')
                .that.eqls(newReview.reviewText);

        });

        it("user id required to edit a review", async () => {
            const inserted = await reviewService.addReview(
                {id: undefined, ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("You must supply an id.");
        });

        it("a review must have a valid id", async () => {
            const inserted = await reviewService.addReview(
                {id: 'abc', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("abc is not a valid ObjectId");
        });

        it("should NOT create a review for unregistered user", async () => {
            const inserted = await reviewService.addReview(
                {id: '1f468dbf5082002118fc8821', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("No valid entry found for provided id !");
        });
    });

    describe('#edit-review', () => {

        it('can edit a review', async () => {

            await reviewRepository.save({
                id: env.ADMIN_ID, new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const createdReview = await reviewRepository.save({
                id: env.ADMIN_ID, new: true, reviews: [{...newReview}]
            });

            const reviewId = (createdReview.reviews[0]._id).toString();

            const editedReview = await reviewService.editReview(
                {id: reviewId, username: env.ADMIN_PSEUDO, ...newReview});

            expect(reviewId).to.be.eql((editedReview.updatedDocument.reviews[0]._id).toString());
            expect(editedReview.updatedDocument.reviews[0].rating).to.be.eql(newReview.rating);
            expect(editedReview.updatedDocument.reviews[0].reviewText).to.be.eql(newReview.reviewText);

        });

        it("review id required to edit a review", async () => {
            const inserted = await reviewService.editReview(
                {id: undefined, username: 'abc', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("You must supply an id.");
        });

        it("a review must have a valid id", async () => {
            const inserted = await reviewService.editReview(
                {id: 'abc', username: 'abc', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("abc is not a valid ObjectId");
        });

        it("username required to edit a review", async () => {
            const inserted = await reviewService.editReview(
                {id: '1f468dbf5082002118fc8821', username: undefined, ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("You must supply the username.");
        });

        it("can't edit a review for unregistered user", async () => {
            const inserted = await reviewService.editReview(
                {id: '1f468dbf5082002118fc8821', username: '*****', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("No user was found with provided username");
        });
    });
});
