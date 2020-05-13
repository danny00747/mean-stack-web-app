const puppeteer = require('puppeteer');
const {expect} = require('chai');

describe('E2E TESTS', async () => {
    let browser;
    let page;

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                '--window-size=1920,1080',
            ],
        });
        page = await browser.newPage();
        await page.goto("http://localhost:4200");
    });

    afterEach(async () => {
        await browser.close();
    });

    it('should nagivate to the login page', async () => {

        await Promise.all([
            page.waitForNavigation(),
            page.click('#loginBtn')
        ]);

        const msg = await page.$eval('#formTitle', e => e.innerText);
        expect(msg).to.eql("Log in to your account");
        //await page.waitFor(3000);
    });

    it('login button should be disabled', async () => {

        await Promise.all([
            page.waitForNavigation(),
            page.click('#loginBtn')
        ]);

        expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(true);
    });


    it('it should login a user in the form fields', async () => {

        await Promise.all([
            page.waitForNavigation(),
            page.click('#loginBtn')
        ]);

       const pseudo = await page.$('#pseudo');
       const password = await page.$('#password');
       const submit = await page.$('#submitBtn');

        await pseudo.click({ clickCount: 3 });
        await pseudo.type('dan30@gmail.com');

        await password.click({ clickCount: 3});
        await password.type('toto');

        await submit.click();
        await page.waitForNavigation();

        expect(page.url()).eql('http://localhost:4200/dashboard');
    });

});
