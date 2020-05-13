//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let Review = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

describe('Reviews', () => {

    /*
     * Test the /GET reviews route
     */
    describe('/GET reviews', () => {

        it('it should get all reviews',  (done) => {

            chai.request(server)
                .get('/server/api/reviews/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                });
        });

    });
});
