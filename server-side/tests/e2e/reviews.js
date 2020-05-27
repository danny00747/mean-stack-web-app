const puppeteer = require('puppeteer');
const {expect} = require('chai');
const scroll = require("./admin");

describe('E2E TESTS FOR REVIEWS PAGE', async () => {
    
    let browser;
    let page;

    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            slowMo: 35,
            args: [
                '--window-size=1920,1080',
            ],
        });
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto("http://localhost:4200/reviews");
    });

    after(async () => {
        await browser.close();
    });

    describe('/GET Reviews', () => {

        it('it should display all reviews', async () => {

            await page.waitFor(1000);

            expect((await page.$eval('#comments', e => e.innerText))
                .includes('comments'))
                .to.eql(true);

            await scroll.autoScroll(page);

            await page.waitFor(1000);

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

    describe('/POST Review', () => {

        it('it should create a review', async () => {

            await page.waitFor(1000);

            expect((await page.$eval('#comments', e => e.innerText))
                .includes('comments'))
                .to.eql(true);

            const loginBtn = await page.$('#loginBtn');
            await loginBtn.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/login');

            await page.waitFor(1000);

            const pseudo = await page.$('#pseudo');
            const password = await page.$('#password');
            const loginSubmit = await page.$('#submitBtn');

            await pseudo.click({clickCount: 3});
            await pseudo.type('dan30@gmail.com');

            await password.click({clickCount: 3});
            await password.type('toto');

            await loginSubmit.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            const reviewBtn = await page.$('#reviewsBtn');

            await reviewBtn.click();
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/reviews');

            await page.reload();

            await page.waitFor(1000);

            const addReviewBtn = await page.$('#addReviewBtn');

            await addReviewBtn.click();

            await page.waitFor(1000);

            expect(await page.$eval('#reviewSubmit', btn => btn.disabled)).eql(true);

            const inputRating = await page.$('#inputRating');
            await inputRating.click({clickCount: 3});
            await inputRating.type('7');

            const reviewComment = await page.$('#reviewComment');
            await reviewComment.click({clickCount: 3});
            await reviewComment.type('This a review added by an automated software !');

            expect(await page.$eval('#reviewSubmit', btn => btn.disabled)).eql(false);

            const reviewSubmit = await page.$('#reviewSubmit');
            await reviewSubmit.click();

            await page.waitFor(1000);

            expect(await page.$eval('#createSuccess', el => el.innerText))
                .eql('Review created successfully !');

            await page.waitFor(1000);

            await page.click('[id="modalClose"]');

            await page.waitFor(2000);

        });

        it('it should update a review', async () => {

            expect(page.url()).eql('http://localhost:4200/reviews');

            await page.waitFor(1000);

            await page.click('[name="updateReview"]');

            await page.waitFor(1000);

            expect(await page.$eval('#reviewSubmit', btn => btn.disabled)).eql(true);

            const inputRating = await page.$('#inputRating');
            await inputRating.click({clickCount: 3});
            await inputRating.type('7');

            const reviewComment = await page.$('#reviewComment');
            await reviewComment.click({clickCount: 3});
            await reviewComment.type('This review has been updated by an automated software !');

            expect(await page.$eval('#reviewSubmit', btn => btn.disabled)).eql(false);

            const reviewSubmit = await page.$('#reviewSubmit');
            await reviewSubmit.click();

            await page.waitFor(1000);

            expect(await page.$eval('#createSuccess', el => el.innerText))
                .eql('Review updated successfully !');

            await page.waitFor(1000);

            await page.click('[id="modalClose"]');

            await page.waitFor(2000);

        });

        it('it should delete a review', async () => {

            expect(page.url()).eql('http://localhost:4200/reviews');

            //await page.reload();

            await page.waitFor(1000);

            await page.click('[name="deleteReview"]');

            await page.waitFor(1000);

            await page.click('[id="deleteSubmit"]');

            await page.waitFor(1000);

            expect(await page.$eval('#reviewdeleteAlert', el => el.innerText))
                .eql('Review deleted successfully !');

            await page.waitFor(1000);

            await page.click('[id="deleteClose"]');

            await page.waitFor(3000);


        });

    });

});
