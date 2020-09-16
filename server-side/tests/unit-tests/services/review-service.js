//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//import server to bring in everything together
import server from "../../../../app";

//bring in dev-dependencies
import  {expect} from 'chai';
import {describe, it, after} from 'mocha';

import makeFakeReview from '../../fixtures/fakeReview'
import env from '../../../config/environment'
import {reviewService} from "../../../services"
import {reviewRepository} from '../../../repository'

describe('REVIEW SERVICE', () => {

    after(async () => {
        await reviewRepository.save({
            id: env["ADMIN_ID"], new: true, reviews: [
                {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
        });
    });


    describe('#add-review', () => {

        it('inserts a review in the database', async () => {

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const inserted = await reviewService.addReview(
                {id: env["ADMIN_ID"], ...newReview});

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

    describe('#list-reviews', () => {

        it('get all reviews in the database', async () => {
            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [
                    {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
            });

            const reviews = await reviewService.listReviews();

            expect(reviews).not.to.be.empty;
        });
    });

    describe('#edit-review', () => {

        it('can edit a review', async () => {

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const createdReview = await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [{...newReview}]
            });

            const reviewId = (createdReview.reviews[0]._id).toString();

            const editedReview = await reviewService.editReview(
                {id: reviewId, username: env["ADMIN_PSEUDO"], ...newReview});

            expect(reviewId).to.be.eql((editedReview.updatedDocument.reviews[0]._id).toString());
            expect(editedReview.updatedDocument.reviews[0].rating).to.be.eql(newReview.rating);
            expect(editedReview.updatedDocument.reviews[0].reviewText).to.be.eql(newReview.reviewText);

        });

        it("a review must have a valid id", async () => {
            const inserted = await reviewService.editReview(
                {id: 'abc', username: 'abc', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("abc is not a valid ObjectId");
        });

        it("review id required to edit a review", async () => {
            const inserted = await reviewService.editReview(
                {id: undefined, username: 'abc', ...makeFakeReview()});
            expect(inserted.message)
                .to.equal("You must supply an id.");
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

        it("can't edit a review given a wrong review id ", async () => {

            const editedReview = await reviewService.editReview(
                {
                    id: '1f468dbf5082002118fc8821', username: env["ADMIN_PSEUDO"],
                    ...makeFakeReview()
                });

            expect(editedReview.message)
                .to.equal('No was review found with provided id !');
        });

        it("can't edit a review for a registered user with no reviews", async () => {

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const editedReview = await reviewService.editReview(
                {id: '1f468dbf5082002118fc8821', username: env["ADMIN_PSEUDO"], ...newReview});

            expect(editedReview.message)
                .to.equal(`${env["ADMIN_PSEUDO"]} doesn't have any reviews at the moment !`);

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [
                    {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
            });
        });
    });

    describe('#delete-review', () => {

        it('can delete a review', async () => {

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: []
            });

            const {...newReview} = makeFakeReview();

            const createdReview = await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [{...newReview}]
            });

            const reviewId = (createdReview.reviews[0]._id).toString();

            const deletedReview = await reviewService.removeReview(
                {id: reviewId, username: env["ADMIN_PSEUDO"]});

            expect(deletedReview.ancientDocument.reviews).not.to.be.empty;
            expect(reviewId).to.be.eql((deletedReview.ancientDocument.reviews[0]._id).toString());
            expect(deletedReview.ancientDocument.reviews[0].rating).to.be.eql(newReview.rating);
            expect(deletedReview.ancientDocument.reviews[0].reviewText).to.be.eql(newReview.reviewText);

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [
                    {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
            });
        });

        it("a review must have a valid id", async () => {
            const inserted = await reviewService.removeReview(
                {id: 'abc', username: 'abc'});
            expect(inserted.message)
                .to.equal("abc is not a valid ObjectId");
        });

        it("username required to delete a review", async () => {
            const inserted = await reviewService.editReview(
                {id: '1f468dbf5082002118fc8821', username: undefined});
            expect(inserted.message)
                .to.equal("You must supply the username.");
        });

        it("review id required to delete a review", async () => {
            const inserted = await reviewService.removeReview(
                {id: undefined, username: 'abc'});
            expect(inserted.message)
                .to.equal("You must supply an id.");
        });

        it("can't delete a review for unregistered user", async () => {
            const inserted = await reviewService.removeReview(
                {id: '1f468dbf5082002118fc8821', username: '*****'});
            expect(inserted.message)
                .to.equal("No user was found with provided username !");
        });

        it("can't delete a review given a wrong review id ", async () => {

            const editedReview = await reviewService.removeReview(
                {id: '1f468dbf5082002118fc8821', username: env["ADMIN_PSEUDO"]});

            expect(editedReview.message)
                .to.equal('No was review found with provided id !');
        });

        it("can't delete a review for a registered user with no reviews", async () => {

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: []
            });

            const deletedReview = await reviewService.removeReview(
                {id: '1f468dbf5082002118fc8821', username: env["ADMIN_PSEUDO"]});

            expect(deletedReview.message)
                .to.equal(`${env["ADMIN_PSEUDO"]} doesn't have any reviews at the moment !`);

            await reviewRepository.save({
                id: env["ADMIN_ID"], new: true, reviews: [
                    {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
            });
        });
    });
});
