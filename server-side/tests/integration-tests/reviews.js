//During the test the env variable is set to test
import Question from "../../models/questions";

process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai from 'chai';
import {assert, should, expect} from 'chai';
import {describe, before, it, after} from 'mocha';
import chaiHttp from 'chai-http';

import server from '../../../app';
import {User} from '../../models/users';
import makeTwoUsers from '../fixtures/make2users'
import env from '../../config/environment';
import {reviewRepository, userRepository} from '../../repository'

chai.use(chaiHttp);

describe('Reviews', () => {

    let loginUser = "";
    let createReview = "";

    const user = {
        "pseudo": env.ADMIN_PSEUDO,
        "password": env.ADMIN_PSD,
    };

    before(async () => {

        loginUser = await chai.request(server)
            .post('/server/api/login')
            .send(user);

        createReview = await chai.request(server)
            .post(`/server/api/user/${env.ADMIN_ID}/reviews`)
            .send({"rating": 3, "reviewText": "This is the 3rd review"})
            .set('Authorization', loginUser.body.token);
    });

    after(async () => {
        await reviewRepository.save({
            id: env.ADMIN_ID, new: true, reviews: [
                {"rating": 3, "reviewText": "This is the 3rd review !!!"}]
        });
    });

    /*
     * Test the /ET route
     */
    describe('/GET reviews', () => {

        it('it should get all reviews', async () => {

            const reviews = await chai.request(server)
                .get('/server/api/reviews/all');

            reviews.status.should.be.eql(200);
            reviews.body.should.be.an('array');
        });

    });

    /*
     * Test the /POST route
     */
    describe('/POST review', () => {

        it('it should create a review', async () => {

            createReview.status.should.be.eql(201);
            createReview.body.should.have.property('message')
                .eql('Review created successfully !');
            createReview.body.should.be.a('object');
            expect(createReview.body.updatedUser.reviews.rating).to.equal(3);
            expect(createReview.body.updatedUser
                .reviews.reviewText).to.equal("This is the 3rd review");

        });

        it('it should NOT create a review with a wrong user id', async () => {


            const review = await chai.request(server)
                .post(`/server/api/user/1f468dbf5082002118fc8821/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', loginUser.body.token);

            review.status.should.be.eql(404);
            review.body.should.have.property('message')
                .eql('No valid entry found for provided id !');
        });

        it('it should NOT create a review with a missing or invalid JWT', async () => {

            const createdReview = await chai.request(server)
                .post(`/server/api/user/${env.ADMIN_ID}/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', "abc");

            const createdReview2 = await chai.request(server)
                .post(`/server/api/user/${env.ADMIN_ID}/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', "abc");

            createdReview.status.should.be.eql(401);
            createdReview2.status.should.be.eql(401);

        });

        it("it should make sure a student can't create a review for others", async () => {

            const user1 = makeTwoUsers().user1;
            const user2 = makeTwoUsers().user2;

            const createdUser1 = await chai.request(server)
                .post('/server/api/signup')
                .send(user1);

            const createdUser2 = await chai.request(server)
                .post('/server/api/signup')
                .send(user2);

            await userRepository.patch({
                id: createdUser1.body.user.userId,
                isVerified: true
            });

            const logInUser1 = await chai.request(server)
                .post('/server/api/login')
                .send({"pseudo": user1.username, "password": user1.password});

            const createdReview = await chai.request(server)
                .post(`/server/api/user/${createdUser2.body.user.userId}/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', logInUser1.body.token);

            createdReview.status.should.be.eql(403);
            createdReview.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id : createdUser1.body.user.userId });
            await userRepository.remove({id : createdUser2.body.user.userId });
        });

    });

    /*
     * Test the /PATCH:id route
     */
    describe('/PATCH:id review', () => {

        it('it should PATCH a review with the given id', async () => {

            const username = createReview.body.updatedUser.reviews.author;
            const reviewId = createReview.body.updatedUser.reviews._id;

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${username}/reviews/${reviewId}`)
                .send({"rating": 2, "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updateReview.status.should.be.eql(200);
            updateReview.body.should.be.a('object');
            updateReview.body.should.have.property('message')
                .eql('Review updated successfully !');

            expect(updateReview.body.updatedUser.updatedReview.rating).to.equal(2);
            expect(updateReview.body.updatedUser.updatedReview
                .reviewText).to.equal("This is the 1st review");

        });

        it('it should NOT PATCH a review with a wrong id', async () => {

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${env.ADMIN_PSEUDO}/reviews/7e7fd1d5f71b123cbc246700`)
                .send({"rating": 3, "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updateReview.status.should.be.eql(404);
            updateReview.body.should.have.property('message')
                .eql('No was review found with provided id !');

        });

        it('it should NOT PATCH a review whose user has none', async () => {

            const randomUser = Math.random().toString(36).substr(2, 6);

            const newUser = {
                "username": randomUser,
                "email": `${randomUser}@gmail.com`,
                "password": randomUser
            };

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            const username = createdUser.body.user.username;

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${username}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token)
                .send({"rating": 3, "reviewText": "This is the 3rd review"});

            updateReview.status.should.be.eql(404);
            updateReview.body.should.have.property('message')
                .eql(`${createdUser.body.user.username} doesn't have any reviews at the moment !`);

            await User.findByIdAndRemove({_id: createdUser.body.user.userId}).exec();

        });

        it('it should NOT PATCH a review for unregistered user', async () => {

            const username = Math.random().toString(36).substr(2, 9);

            const updatedReview = await chai.request(server)
                .patch(`/server/api/user/${username}/reviews/7e7fd1d5f71b123cbc246700`)
                .send({"rating": 2, "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updatedReview.status.should.be.eql(404);
            updatedReview.body.should.have.property('message')
                .eql('No user was found with provided email');

        });

        it('it should NOT PATCH a review with a missing or invalid JWT', async () => {

            const createdReview = await chai.request(server)
                .patch(`/server/api/user/abc/reviews/123`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', "abc");

            const createdReview2 = await chai.request(server)
                .patch(`/server/api/user/abc/reviews/123`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"});

            createdReview.status.should.be.eql(401);
            createdReview2.status.should.be.eql(401);
        });

        it("it should make sure a student can't update a review for others", async () => {

            const user1 = makeTwoUsers().user1;
            const user2 = makeTwoUsers().user2;

            const createdUser1 = await chai.request(server)
                .post('/server/api/signup')
                .send(user1);

            const createdUser2 = await chai.request(server)
                .post('/server/api/signup')
                .send(user2);

            await userRepository.patch({
                id: createdUser1.body.user.userId,
                isVerified: true
            });

            await userRepository.patch({
                id: createdUser2.body.user.userId,
                isVerified: true
            });

            const logInUser1 = await chai.request(server)
                .post('/server/api/login')
                .send({"pseudo": user1.username, "password": user1.password});

            const logInUser2 = await chai.request(server)
                .post('/server/api/login')
                .send({"pseudo": user2.username, "password": user2.password});

            const firstUserId = createdUser1.body.user.userId;
            const username1 = createdUser1.body.user.username;

            const user1Review = await chai.request(server)
                .post(`/server/api/user/${firstUserId}/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', logInUser1.body.token);

            const user1ReviewId = user1Review.body.updatedUser.reviews._id;

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${username1}/reviews/${user1ReviewId}`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', logInUser2.body.token);

            updateReview.status.should.be.eql(403);
            updateReview.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id : createdUser1.body.user.userId });
            await userRepository.remove({id : createdUser2.body.user.userId });

        });

    });

    /*
     * Test the /DELETE:id route
     */
    describe('/DELETE:id review', () => {

        it('it should DELETE a review with the given id', async () => {

            const username = createReview.body.updatedUser.reviews.author;
            const reviewId = createReview.body.updatedUser.reviews._id;

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${username}/reviews/${reviewId}`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(200);
            deletedReview.body.should.be.a('object');
            expect(deletedReview.body.updatedUser.removedReview._id).to.equal(reviewId);
            deletedReview.body.should.have.property('message')
                .eql('Review deleted successfully !');

        });

        it('it should NOT DELETE a review with a wrong id', async () => {

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${env.ADMIN_PSEUDO}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql('No was review found with provided id !');

        });

        it('it should NOT DELETE a review whose user has none', async () => {

            const randomUser = Math.random().toString(36).substr(2, 6);

            const newUser = {
                "username": randomUser,
                "email": `${randomUser}@gmail.com`,
                "password": randomUser
            };

            const createdUser = await chai.request(server)
                .post('/server/api/signup')
                .send(newUser);

            const username = createdUser.body.user.username;

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${username}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql(`${createdUser.body.user.username} doesn't have any reviews at the moment !`);

            await User.findByIdAndRemove({_id: createdUser.body.user.userId}).exec();

        });

        it('it should NOT DELETE a review for unregistered user', async () => {

            const username = Math.random().toString(36).substr(2, 9);

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${username}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql('No user was found with provided email !');

        });

        it('it should NOT DELETE a review with a missing or invalid JWT', async () => {

            const createdReview = await chai.request(server)
                .delete(`/server/api/user/abc/reviews/123`)
                .set('Authorization', "abc");

            const createdReview2 = await chai.request(server)
                .delete(`/server/api/user/abc/reviews/123`);

            createdReview.status.should.be.eql(401);
            createdReview2.status.should.be.eql(401);
        });

        it("it should make sure a student can't delete a review for others", async () => {

            const user1 = makeTwoUsers().user1;
            const user2 = makeTwoUsers().user2;

            const createdUser1 = await chai.request(server)
                .post('/server/api/signup')
                .send(user1);

            const createdUser2 = await chai.request(server)
                .post('/server/api/signup')
                .send(user2);

            await userRepository.patch({
                id: createdUser1.body.user.userId,
                isVerified: true
            });

            await userRepository.patch({
                id: createdUser2.body.user.userId,
                isVerified: true
            });

            const logInUser1 = await chai.request(server)
                .post('/server/api/login')
                .send({"pseudo": user1.username, "password": user1.password});

            const logInUser2 = await chai.request(server)
                .post('/server/api/login')
                .send({"pseudo": user2.username, "password": user2.password});

            const firstUserId = createdUser1.body.user.userId;
            const username1 = createdUser1.body.user.username;

            const user1Review = await chai.request(server)
                .post(`/server/api/user/${firstUserId}/reviews`)
                .send({"rating": 3, "reviewText": "This is the 3rd review"})
                .set('Authorization', logInUser1.body.token);

            const user1ReviewId = user1Review.body.updatedUser.reviews._id;

            const updateReview = await chai.request(server)
                .delete(`/server/api/user/${username1}/reviews/${user1ReviewId}`)
                .set('Authorization', logInUser2.body.token);

            updateReview.status.should.be.eql(403);
            updateReview.body.should.have.property('message')
                .eql(`You don't have enough permission to perform this action !`);

            await userRepository.remove({id : createdUser1.body.user.userId });
            await userRepository.remove({id : createdUser2.body.user.userId });

        });
    });
});
