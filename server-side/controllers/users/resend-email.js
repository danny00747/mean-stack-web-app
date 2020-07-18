import {resendEmailService} from '../../services/users'
import sendMail from '../../helpers/sendMail'

export default function makeResendEmailController() {
    return async (httpRequest) => {

        try {
            const {userEmail: email} = httpRequest.params;

            const updatedUser = await resendEmailService({email});

            if (updatedUser.message) {

                return {
                    statusCode: 404,
                    body: {
                        ...updatedUser,
                    }
                }
            }

            sendMail(updatedUser.findUser.email, updatedUser.key.randomKey);

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "A verification email has been resent to "
                        + updatedUser.findUser.email
                }
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
