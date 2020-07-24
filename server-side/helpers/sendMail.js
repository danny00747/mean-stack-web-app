import sgMail from '@sendgrid/mail';
import mailTemplate from './sendMailTemplate'
import env from '../config/environment'

export default function sendMail(mail, key) {

    sgMail.setApiKey(env.SENDGRID_API_KEY);

        const msg = {
            to: `${mail}`,
            from: 'he201718@students.ephec.be',
            subject: 'Welcome to TeacherApp! Confirm Your Email',
            html: mailTemplate
                .replace("xxx@xxxx", `${mail}`)
                .replace("link@link1",
                    `https://devwebapp.herokuapp.com/verify-email/${key}`)
                .replace("link@link2",
                    `https://devwebapp.herokuapp.com/verify-email/${key}`)
                .replace("link@link3",
                    `https://devwebapp.herokuapp.com/verify-email/${key}`)
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
