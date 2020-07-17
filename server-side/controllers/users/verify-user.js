import {verifyUserService} from '../../services/users'
import {addLogService} from '../../services/logs'

export default function makeVerifyUserController() {
    return async (httpRequest) => {

        try {
            const {key : randomKey} = httpRequest.params;

            const updatedUser = await verifyUserService({key : randomKey});

            if (updatedUser.message) {

                return {
                    statusCode: 404,
                    body: {
                        success: false,
                        ...updatedUser,
                    }
                }
            }

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message : `${updatedUser.email} has been verified !`,
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
