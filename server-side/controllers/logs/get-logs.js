const sgMail = require('@sendgrid/mail');
import toto from './temp'
export default function makeGetLogsController({getAllLogService}) {
    return async (httpRequest) => {

        sgMail.setApiKey(process.env["SENDGRID_API_KEY"]);
        const msg = {
            to: 'shepalau007@gmail.com',
            from: 'HE201718@students.ephec.be',
            subject: 'Welcome to TeacherApp! Confirm Your Email',
            html: toto.replace("xxx@xxxx", "HE201718@students.ephec.be")
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
