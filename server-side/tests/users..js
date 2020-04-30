//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let User = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();


describe('Users', () => {


    /*
     * Test the /GET route
     */
    describe('/POST user', () => {
        it('it should POST a user', (done) => {

            const user = {
                "pseudo": "admin",
                "password": "admin"
            };

            chai.request(server)
                .post('/server/api/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have
                        .property('message')
                        .eql('Auth successful');
                    res.body.should.have
                        .property('token');
                    done();
                });
        });
    });
});
