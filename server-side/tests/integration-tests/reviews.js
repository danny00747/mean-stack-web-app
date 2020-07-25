//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//bring in dev-dependencies
import chai from 'chai';
import {assert, should, expect} from 'chai';
import {describe, before, it} from 'mocha';
import chaiHttp from 'chai-http';

import server from '../../../app';
import {User} from '../../models/users';
import env from '../../config/environment';

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
            .send({"rating": "3", "reviewText": "This is the 3rd review"})
            .set('Authorization', loginUser.body.token);
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

            const review = await chai.request(server)
                .post(`/server/api/user/${env.ADMIN_ID}/reviews`)
                .send({"rating": "3", "reviewText": "This is the 3rd review"})
                .set('Authorization', loginUser.body.token);

            review.status.should.be.eql(201);
            review.body.should.have.property('message')
                .eql('Review created successfully !');
            review.body.should.be.a('object');
            expect(review.body.updatedUser.reviews.rating).to.equal(3);
            expect(review.body.updatedUser
                .reviews.reviewText).to.equal("This is the 3rd review");

        });

        xit('it should NOT create a review with a missing or invalid JWT', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "3",
                "reviewText": "This is the 3rd review"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    const userId = res1.body.user.userId;
                    chai.request(server)
                        .post(`/server/api/user/${userId}/reviews`)
                        .send(review)
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
        });

        it('it should NOT create a review with a wrong user id', async () => {


            const review = await chai.request(server)
                .post(`/server/api/user/1f468dbf5082002118fc8821/reviews`)
                .send({"rating": "3", "reviewText": "This is the 3rd review"})
                .set('Authorization', loginUser.body.token);

            review.status.should.be.eql(404);
            review.body.should.have.property('message')
                .eql('No valid entry found for provided id !');
        });

    });

    /*
     * Test the /PATCH:id route
     */
    describe('/PATCH:id review', () => {

        it('it should PATCH a review with the given id', async () => {

            const userEmail = createReview.body.updatedUser.reviews.author;
            const reviewId = createReview.body.updatedUser.reviews._id;

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                .send({"rating": "2", "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updateReview.status.should.be.eql(200);
            updateReview.body.should.be.a('object');
            updateReview.body.should.have.property('message')
                .eql('Review updated successfully !');

            expect(updateReview.body.updatedUser.updatedReview.rating).to.equal(2);
            expect(updateReview.body.updatedUser.updatedReview
                .reviewText).to.equal("This is the 1st review");

        });

        it('it should NOT PATCH a review whose user is non-existent', async () => {

            const email = Math.random().toString(36).substr(2, 9);

            const updatedReview = await chai.request(server)
                .patch(`/server/api/user/${email}@gmail.com/reviews/7e7fd1d5f71b123cbc246700`)
                .send({"rating": "2", "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updatedReview.status.should.be.eql(404);
            updatedReview.body.should.have.property('message')
                .eql('No user was found with provided email');

        });

        it('it should NOT PATCH a review with a wrong id', async () => {

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${env.ADMIN_PSEUDO}@gmail.com/reviews/7e7fd1d5f71b123cbc246700`)
                .send({"rating": "2", "reviewText": "This is the 1st review"})
                .set('Authorization', loginUser.body.token);

            updateReview.status.should.be.eql(404);
            updateReview.body.should.have.property('message')
                .eql('No was review found with provided id !');

        });

        xit('it should NOT PATCH a review with a missing or invalid JWT', async () => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "3",
                "reviewText": "This is the 3rd review"
            };

            const userEmail = "dan30@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .send(review)
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
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

            const userEmail = createdUser.body.user.userEmail;

            const updateReview = await chai.request(server)
                .patch(`/server/api/user/${userEmail}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token)
                .send({"rating": "3", "reviewText": "This is the 3rd review"});

            updateReview.status.should.be.eql(404);
            updateReview.body.should.have.property('message')
                .eql(`${createdUser.body.user.username} doesn't have any reviews at the moment !`);

            await User.findByIdAndRemove({_id: createdUser.body.user.userId}).exec();

        });

    });

    /*
     * Test the /DELETE:id route
     */
    describe('/DELETE:id review', () => {

        it('it should DELETE a review with the given id', async () => {

            const userEmail = createReview.body.updatedUser.reviews.author;
            const reviewId = createReview.body.updatedUser.reviews._id;

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(200);
            deletedReview.body.should.be.a('object');
            expect(deletedReview.body.updatedUser.removedReview._id).to.equal(reviewId);
            deletedReview.body.should.have.property('message')
                .eql('Review deleted successfully !');

        });

        it('it should NOT DELETE a review whose user is non-existent', async () => {

            const email = Math.random().toString(36).substr(2, 9);

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${email}@gmail.com/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql('No user was found with provided email !');

        });

        it('it should NOT DELETE a review with a wrong id', async () => {

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${env.ADMIN_PSEUDO}@gmail.com/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql('No was review found with provided id !');

        });

        xit('it should NOT DELETE a review with a missing or invalid JWT', async () => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const userEmail = "dan30@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end(() => {
                    chai.request(server)
                        .delete(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .end((err, res2) => {
                            res2.should.have.status(401);
                            Object.keys(res2.body).length.should.be.eql(0);
                        });
                    done();
                });
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

            const userEmail = createdUser.body.user.userEmail;

            const deletedReview = await chai.request(server)
                .delete(`/server/api/user/${userEmail}/reviews/7e7fd1d5f71b123cbc246700`)
                .set('Authorization', loginUser.body.token);

            deletedReview.status.should.be.eql(404);
            deletedReview.body.should.have.property('message')
                .eql(`${createdUser.body.user.username} doesn't have any reviews at the moment !`);

            await User.findByIdAndRemove({_id: createdUser.body.user.userId}).exec();

        });

    });

});
