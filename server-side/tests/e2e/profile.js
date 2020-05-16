const puppeteer = require('puppeteer');
const {expect} = require('chai');
const Login = require("./login");

describe('E2E TESTS FOR PROFILE PAGE', async () => {

    //slowMo: 20,
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            slowMo: 35,
            args: [
                '--window-size=1920,1080',
            ],
        });
        page = await browser.newPage();
        await page.goto("http://localhost:4200/login");
    });

    afterEach(async () => {
        await browser.close();
    });

    describe('/GET User', () => {

        xit("it should display the user's profile", async () => {

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(true);

            const pseudo = await page.$('#pseudo');
            const password = await page.$('#password');
            const submit = await page.$('#submitBtn');

            await pseudo.click({clickCount: 3});
            await pseudo.type('dan30@gmail.com');

            await password.click({clickCount: 3});
            await password.type('toto');

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(false);

            await submit.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            const profile = await page.$('#profileBtn');

            await profile.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/profile/dan30');

        });

    });

    describe('/PATCH User', () => {

        xit("it should update the user's profile", async () => {

            const pseudo = await page.$('#pseudo');
            const password = await page.$('#password');
            const submit = await page.$('#submitBtn');

            await pseudo.click({clickCount: 3});
            await pseudo.type('dan30@gmail.com');

            await password.click({clickCount: 3});
            await password.type('toto');

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(false);

            await submit.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            const profile = await page.$('#profileBtn');

            await profile.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/profile/dan30');

            await page.waitFor(1000);

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(true);

            const updateUser = await page.$('#updateUser');

            await updateUser.click();

            const username = await page.$('#username');
            const email = await page.$('#inputEmail');
            const passwordUpdate = await page.$('#inputPassword');
            const confirmPassword = await page.$('#passwordConfirm');
            const submitUpdate = await page.$('#submitUpdate');

            await page.waitFor(1000);

            await username.click({clickCount: 3});
            await username.type('dan30');

            await email.click({clickCount: 3});
            await email.type(`dan30@gmail.com`);

            await passwordUpdate.click({clickCount: 3});
            await passwordUpdate.type('toto');

            await confirmPassword.click({clickCount: 3});
            await confirmPassword.type('toto');

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(false);

            await submitUpdate.click();

            await page.waitFor(1000);

            expect(await page.$eval('#updateSuccess', el => el.innerHTML))
                .eql(' User info updated successfully ! ');

        });

    });

    describe('/user profile update errors', () => {

        xit("it should display an error if the passwords don't match", async () => {

            const pseudo = await page.$('#pseudo');
            const password = await page.$('#password');
            const submit = await page.$('#submitBtn');

            await pseudo.click({clickCount: 3});
            await pseudo.type('dan30@gmail.com');

            await password.click({clickCount: 3});
            await password.type('toto');

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(false);

            await submit.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            const profile = await page.$('#profileBtn');

            await profile.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/profile/dan30');

            await page.waitFor(1000);

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(true);

            const updateUser = await page.$('#updateUser');

            await updateUser.click();

            const passwordUpdate = await page.$('#inputPassword');
            const confirmPassword = await page.$('#passwordConfirm');

            await page.waitFor(1000);

            await passwordUpdate.click({clickCount: 3});
            await passwordUpdate.type('toto');

            await confirmPassword.click({clickCount: 3});
            await confirmPassword.type('totos');

            await passwordUpdate.click({clickCount: 3});

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(true);

            await page.waitFor(1000);

            expect(await page.$eval('#passwordMatchError', el => el.innerHTML))
                .eql('Passwords do not match');

        });

        xit("it should display an error on any form field in an invalid state", async () => {

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(true);

            const pseudo = await page.$('#pseudo');
            const loginPassword = await page.$('#password');
            const submit = await page.$('#submitBtn');

            await pseudo.click({clickCount: 3});
            await pseudo.type('dan30@gmail.com');

            await loginPassword.click({clickCount: 3});
            await loginPassword.type('toto');

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(false);

            await submit.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            const profile = await page.$('#profileBtn');

            await profile.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/profile/dan30');

            await page.waitFor(1000);

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(true);

            const updateUser = await page.$('#updateUser');

            await updateUser.click();

            await page.waitFor(1000);

            const username = await page.$('#username');
            const password = await page.$('#inputPassword');
            const confirmPassword = await page.$('#passwordConfirm');

            await page.waitFor(1000);

            await password.click({clickCount: 3});
            await password.type('');

            await confirmPassword.click({clickCount: 3});
            await confirmPassword.type('');

            await username.click({clickCount: 1});

            expect(await page.$eval('#passwordRequired', el => el.innerHTML))
                .eql('A password is required');

            expect(await page.$eval('#confirmPasswordError', el => el.innerHTML))
                .eql('Please confirm your password');

            expect(await page.$eval('#submitUpdate', btn => btn.disabled)).eql(true);

            await page.waitFor(3000);



        });

    });

});
