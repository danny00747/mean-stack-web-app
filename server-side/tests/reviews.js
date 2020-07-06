//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Review = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

describe('Reviews', () => {

    describe('/GET reviews', () => {

        it('it should get all reviews', (done) => {

            chai.request(server)
                .get('/server/api/reviews/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

    });


    describe('/POST review', () => {

        it('it should create a review', (done) => {

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
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(201);
                            res2.body.should.have.property('message')
                                .eql('Review created successfully !');
                            res2.body.review.should.be.a('object');
                        });
                    done();
                });
        });

        it('it should NOT create a review with a missing or invalid JWT', (done) => {

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

        it('it should NOT create a review with a wrong user id', (done) => {

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
                    chai.request(server)
                        .post('/server/api/user/1f468dbf5082002118fc8821/reviews')
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No user found with the provided ID');
                        });
                    done();
                });
        });

    });

    describe('/PATCH:id review', () => {

        it('it should PATCH a review with the given email', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "9",
                "reviewText": "This is mocha"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    const userId = res1.body.user.userId;
                    const userEmail = res1.body.user.userEmail;
                    chai.request(server)
                        .post(`/server/api/user/${userId}/reviews`)
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const reviewId = res2.body.review._id;
                            review.rating = "10";
                            chai.request(server)
                                .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                                .send(review)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(200);
                                    res3.body.should.have.property('message')
                                        .eql('Review updated successfully !');
                                    res2.body.review.should.be.a('object');
                                });
                        });
                    done();
                });
        });

        it('it should NOT PATCH a review whose user is non-existent', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "9",
                "reviewText": "This is mocha"
            };

            const userEmail = "@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No user was found with provided Email');
                            done();
                        });
                });
        });

        it('it should NOT PATCH a review with a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "9",
                "reviewText": "This is mocha"
            };

            const userEmail = "dan30@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No was review found with provided ID');
                            done();
                        });
                });
        });

        it('it should NOT PATCH a review with a missing or invalid JWT', (done) => {

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

        it('it should NOT PATCH a review whose user has none', (done) => {

            const user = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            const review = {
                "rating": "3",
                "reviewText": "This is the 3rd review"
            };

            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/login')
                        .send({
                            "pseudo": user,
                            "password": "toto"
                        })
                        .end((err, res1) => {
                            chai.request(server)
                                .patch(`/server/api/user/${user1.email}/reviews/${reviewId}`)
                                .set('Authorization', res1.body.token)
                                .send(review)
                                .end((err, res2) => {
                                    res2.should.have.status(404);
                                    res2.body.should.have.property('message')
                                        .eql('No Review to update');
                                });
                        });
                    done();
                });
        });

        it("it should NOT PATCH a review if some request body's field(s) are not allowed", (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "9",
                "reviewText": "This is mocha",
                "reviewComment": "This is mocha v2"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    const userId = res1.body.user.userId;
                    const userEmail = res1.body.user.userEmail;
                    chai.request(server)
                        .post(`/server/api/user/${userId}/reviews`)
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const reviewId = res2.body.review._id;
                            review.rating = "10";
                            chai.request(server)
                                .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                                .send(review)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(405);
                                    res3.body.should.have.property('message')
                                        .eql('Some fields are NOT allowed !');
                                });
                        });
                    done();
                });
        });

    });

    describe('/DELETE:id review', () => {

        it('it should DELETE a review with the given id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const review = {
                "rating": "9",
                "reviewText": "This is mocha"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    const userId = res1.body.user.userId;
                    const userEmail = res1.body.user.userEmail;
                    chai.request(server)
                        .post(`/server/api/user/${userId}/reviews`)
                        .send(review)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            const reviewId = res2.body.review._id;
                            chai.request(server)
                                .delete(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                                .send(review)
                                .set('Authorization', res1.body.token)
                                .end((err, res3) => {
                                    res3.should.have.status(200);
                                    res3.body.should.have.property('message')
                                        .eql('Review deleted successfully !');
                                });
                        });
                    done();
                });
        });

        it('it should NOT DELETE a review whose user is non-existent', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const userEmail = "@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .patch(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No user was found with provided Email');
                            done();
                        });
                });
        });

        it('it should NOT DELETE a review with a wrong id', (done) => {

            const user = {
                "pseudo": process.env["ADMIN_PSEUDO"],
                "password": process.env["ADMIN_PSD"]
            };

            const userEmail = "dan30@gmail.com";
            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res1) => {
                    chai.request(server)
                        .delete(`/server/api/user/${userEmail}/reviews/${reviewId}`)
                        .set('Authorization', res1.body.token)
                        .end((err, res2) => {
                            res2.should.have.status(404);
                            res2.body.should.have.property('message')
                                .eql('No was review found with provided ID');
                            done();
                        });
                });
        });

        it('it should NOT DELETE a review with a missing or invalid JWT', (done) => {

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

        it('it should NOT DELETE a review whose user has none', (done) => {

            const user = Math.random().toString(36).substr(2, 4);

            const user1 = {
                "username": user,
                "email": `${user}@gmail.com`,
                "password": "toto"
            };

            const reviewId = "1f468dbf5182002118fc8821";

            chai.request(server)
                .post('/server/api/signup')
                .send(user1)
                .end(() => {
                    chai.request(server)
                        .post('/server/api/login')
                        .send({
                            "pseudo": user,
                            "password": "toto"
                        })
                        .end((err, res1) => {
                            chai.request(server)
                                .delete(`/server/api/user/${user1.email}/reviews/${reviewId}`)
                                .set('Authorization', res1.body.token)
                                .end((err, res2) => {
                                    res2.should.have.status(404);
                                    res2.body.should.have.property('message')
                                        .eql('No Review to delete');
                                });
                        });
                    done();
                });
        });

    });
});

