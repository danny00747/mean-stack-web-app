const puppeteer = require('puppeteer');
const {expect} = require('chai');

describe('E2E TESTS FOR ADMIN PAGES', async () => {

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
        page = await browser.newPage();
        await page.goto("http://localhost:4200/login");
    });

    after(async () => {
        await browser.close();
    });

    describe('/GET Users', () => {

        it("it should display all users", async () => {

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(true);

            const pseudo = await page.$('#pseudo');
            const password = await page.$('#password');

            await pseudo.click({clickCount: 3});
            await pseudo.type('admin@gmail.com');

            await password.click({clickCount: 3});
            await password.type('admin');

            expect(await page.$eval('#submitBtn', btn => btn.disabled)).eql(false);

            await page.click('[id="submitBtn"]');
            await page.waitForNavigation();

            expect(page.url()).eql('http://localhost:4200/dashboard');

            await page.click('[id="adminBtn"]');
            await page.click('[id="allUsersBtn"]');

            await page.waitFor(1000);

            await autoScroll(page);

            await page.waitFor(1000);

            const search = await page.$('#search');

            await search.click({clickCount: 3});
            await search.type('dan30@gmail.com');

            await page.waitFor(3000);

            await search.click({clickCount: 3});
            await search.type('A1');

            await page.waitFor(3000);

            await search.click({clickCount: 3});
            await search.type('qsz#$?!%');

            await page.waitFor(2000);

            await search.click({clickCount: 3});
            await search.type('10');

            await page.waitFor(3000);

            page = await browser.newPage();

        });

        it("it should display all questions", async () => {

            await page.goto("http://localhost:4200/questions/all");

            expect(page.url()).eql('http://localhost:4200/questions/all');

            await autoScroll(page);

            let reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');

            while (Number(reviewPage[0]) !== Number(reviewPage[1])) {
                await page.click('[class="pagination-next"]');
                reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');
            }

            await page.waitFor(1000);

            while (Number(reviewPage[0]) !== 1) {
                await page.click('[class="pagination-previous"]');
                reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');
            }

            await page.waitFor(1000);

            page = await browser.newPage();

        });

        it("it should create a fill in the blanks question", async () => {

            await page.goto("http://localhost:4200/questions/all");

            expect(page.url()).eql('http://localhost:4200/questions/all');

            await page.waitFor(1000);

            await page.click('[id="createQuestionBtn"]');
            await page.click('[id="fillInBlanksQuestion"]');

            expect(await page.$eval('#sumbitFillIn', btn => btn.disabled)).eql(true);

            await page.waitFor(1000);

            const fillInQuestion = await page.$('#fillInQuestion');

            await fillInQuestion.type('Albert Einstein {be}[was] born in Germany, ' +
                'on March 14, 1879. Six weeks later his family {move}[moved] to Munich, ' +
                'where he later on {begin}[began] his schooling at the Luitpold Gymnasium.');

            expect(await page.$eval('#sumbitFillIn', btn => btn.disabled)).eql(false);

            await page.waitFor(1000);

            await page.click('[id="sumbitFillIn"]');

            await page.waitFor(2000);

            await page.click('[id="closeFillInModal"]');

            let reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');

            while (Number(reviewPage[0]) !== Number(reviewPage[1])) {
                await page.click('[class="pagination-next"]');
                reviewPage = (await page.$eval('.small-screen', e => e.innerText)).split('/');
            }

            await page.waitFor(4000);

            page = await browser.newPage();
        });

        it("it should display all users results", async () => {

            await page.goto("http://localhost:4200/users/info");

            expect(page.url()).eql('http://localhost:4200/users/info');

            await page.waitFor(3000);

            const search = await page.$('#search');

            await search.click({clickCount: 3});
            await search.type('dan30@gmail.com');

            await page.waitFor(3000);

            await search.click({clickCount: 3});
            await search.type('A1');

            await page.waitFor(3000);

            await search.click({clickCount: 3});
            await search.type('10');

            await page.waitFor(3000);

            page = await browser.newPage();


        });

        it("it should display all metrics", async () => {

            await page.goto("http://localhost:4200/users/metrics");

            expect(page.url()).eql('http://localhost:4200/users/metrics');

            await page.waitFor(1000);

            await page.select('select[name="select1"]', 'method');

            await page.select('select[name="select3"]', 'post');

            await page.waitFor(3000);

            await page.select('select[name="select3"]', 'delete');

            await page.waitFor(3000);

            await page.select('select[name="select3"]', 'get');

            await page.waitFor(3000);

            await page.select('select[name="select1"]', 'status');

            await page.select('select[name="select4"]', '201');

            await page.waitFor(3000);

            await page.select('select[name="select4"]', '401');

            await page.waitFor(3000);

            await page.click('[id="customSwitch1"]');

            await page.waitFor(2000);

            await page.click('[id="logoutBtn"]');

            expect(page.url()).eql('http://localhost:4200/login');

        });

    });

});


 async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0,  distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

module.exports = {
    autoScroll
};
