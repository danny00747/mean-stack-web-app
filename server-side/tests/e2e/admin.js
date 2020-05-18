const puppeteer = require('puppeteer');
const {expect} = require('chai');

describe('E2E TESTS FOR ADMIN PAGE', async () => {

    //slowMo: 20,
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

            await autoScroll(page);

            await page.waitFor(3000);

            await page.click('[id="updateUser"]');

            await page.waitFor(2000);

            await page.click('[id="modalClose"]');

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
            }, 400);
        });
    });
}
