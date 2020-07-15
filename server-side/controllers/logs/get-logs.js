const sgMail = require('@sendgrid/mail');
export default function makeGetLogsController({getAllLogService}) {
    return async (httpRequest) => {

        sgMail.setApiKey(process.env["SENDGRID_API_KEY"]);
        const msg = {
            to: 'danbarca955@gmail.com',
            from: 'shepalau007@gmail.com',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        (async () => {
            try {
                await sgMail.send(msg);
            } catch (error) {
                console.error(error);

                if (error.response) {
                    console.error(error.response.body)
                }
            }
        })();

        try {

            const logs = await getAllLogService(httpRequest.params.limit);

            return {
                statusCode: 200,
                body: [...logs]
            }
        } catch (e) {
            // TODO: Error logging
            console.log(e);
            return {
                statusCode: 400,
                body: {
                    error: e.message
                }
            }
        }
    }
}
