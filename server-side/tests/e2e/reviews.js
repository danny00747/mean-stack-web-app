const puppeteer = require('puppeteer');
const {expect} = require('chai');

describe('E2E TESTS FOR SINGUP PAGE', async () => {

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
        await page.goto("http://localhost:4200/reviews");
    });

    afterEach(async () => {
        await browser.close();
    });

    describe('/GET Reviews', () => {

        it('it should display all reviews', async () => {

            await page.waitFor(1000);

            expect((await page.$eval('#comments', e => e.innerText))
                .includes('comments'))
                .to.eql(true);

            const nextBtn = await page.$('.pagination-next');
            const previousBtn = await page.$('.pagination-previous');
            let reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');

            while (Number(reviewPage[0]) !== Number(reviewPage[1])) {
                await nextBtn.click();
                reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');
            }

            await page.waitFor(1000);

            while (Number(reviewPage[0]) !== 1) {
                await previousBtn.click();
                reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');
            }

            await page.waitFor(1000);

        });

    });

});
