import sgMail from '@sendgrid/mail';
import mailTemplate from './sendMailTemplate'

export default function sendMail(mail, key) {

    sgMail.setApiKey(process.env["SENDGRID_API_KEY"]);

        const msg = {
            to: 'shepalau007@gmail.com',
            from: 'he201718@students.ephec.be',
            subject: 'Welcome to TeacherApp! Confirm Your Email',
            html: mailTemplate
                .replace("xxx@xxxx", `${mail}`)
                .replace("link@link1",
                    `https://devwebapp.herokuapp.com/confirm-email/${key}`)
                .replace("link@link2",
                    `https://devwebapp.herokuapp.com/confirm-email/${key}`)
                .replace("link@link3",
                    `https://devwebapp.herokuapp.com/confirm-email/${key}`)
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

}
