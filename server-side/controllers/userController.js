import {userService, logService} from "../services";
import env from "../config/environment";
import sendMail from "../helpers/sendMail";

export default function userControllerFactory() {
    return Object.freeze({
        registerUser, logInUser, patchUser, getAllUsers,
        getUser, patchScore, deleteUser, verifyUser, resendEmail
    });

    function logging(httpRequest) {
        return {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };
    }

    async function registerUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...userInfo} = httpRequest.body;

            const posted = await userService.addUser({...userInfo});

            if (posted.message) {

                logInfo.status = 409;
                logInfo.message = `${posted.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 409, body: {success: false, ...posted,}}
            }

            logInfo.status = 201;
            logInfo.message = `User created successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            if (env.NODE_ENV === 'production') {
                sendMail(posted.createdUser.email, posted.key.randomKey);
            }

            return {
                statusCode: 201,
                body: {
                    success: true,
                    message: "A verification email has been sent to "
                        + posted.createdUser.email,
                    user: {
                        userId: posted.createdUser._id,
                        username: posted.createdUser.username,
                        userEmail: posted.createdUser.email,
                        role: posted.createdUser.role
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }

    async function logInUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {pseudo, password} = httpRequest.body;

            const user = await userService.logInUser({pseudo, password});

            if (user.message) {

                logInfo.status = 401;
                logInfo.message = 'Authentication failed !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 401, body: {success: false, ...user}};
            }

            if (user.isVerified === false) {

                logInfo.status = 401;
                logInfo.message = 'Your account has not been verified.';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 401,
                    body: {
                        success: false, ...user,
                        message: "Your account has not been verified."
                    }
                };
            }

            const {username, role, email, score, _id: id} = user.existing;

            logInfo.status = 200;
            logInfo.message = 'Authentication successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    success: true, token: user.token,
                    user: {
                        userId: id, username: username,
                        userEmail: email, role: role, score: score
                    }
                }
            }

        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);

            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function patchUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;

            const updatedUser = await userService.editUser({id, ...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {success: false, ...updatedUser,}}
            }

            if (!updatedUser) {

                logInfo.status = 404;
                logInfo.message = `No valid entry found for provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found for provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = `Request successful !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "User info updated successfully",
                    updatedUser: {username: updatedUser.username, email: updatedUser.email}
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function getAllUsers(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const users = await userService.listUsers();

            if (users.length === 0) {

                logInfo.status = 204;
                logInfo.message = 'No users found in the database.';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 204, body: {message: "No Users found in the database"}}
            }

            logInfo.status = 200;
            logInfo.message = 'Request successful !';
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: [...users]
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }

    async function getUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const user = await userService.getUser({id: httpRequest.params.userId});
            if (!user) {

                logInfo.status = 404;
                logInfo.message = `No valid entry found with provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found with provided id"}
                };
            }

            logInfo.status = 200;
            logInfo.message = `Request successful !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    user: {
                        userId: user._id, email: user.email, username: user.username,
                        role: user.role, level: user.level, isVerified : user.isVerified
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}};
        }

    }

    async function patchScore(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {...userInfo} = httpRequest.body;
            const {userId: id} = httpRequest.params;

            const updatedUser = await userService.editScore({id, ...userInfo});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {...updatedUser,}}
            }

            logInfo.status = 200;
            logInfo.message = `User info updated successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "User info updated successfully !",
                    updatedUser: {
                        username: updatedUser.username, email: updatedUser.email,
                        score: updatedUser.score, level: updatedUser.level
                    }
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }

    async function deleteUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const deleteUser =
                await userService.removeUser({id: httpRequest.params.userId});

            if (!deleteUser) {

                logInfo.status = 404;
                logInfo.level = "error";
                logInfo.message = `No valid entry found with provided id`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {
                    statusCode: 404,
                    body: {message: "No valid entry found with provided id"}
                }
            }

            logInfo.status = 200;
            logInfo.message = `User deleted successfully !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    message: "User deleted successfully !",
                    removedUser: {username: deleteUser.username, email: deleteUser.email}
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }

    async function verifyUser(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {key: randomKey} = httpRequest.params;

            const updatedUser = await userService.verifyUser({key: randomKey});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {success: false, ...updatedUser,}}
            }

            logInfo.status = 200;
            logInfo.message = `${updatedUser.email} has been verified !`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {success: true, message: `${updatedUser.email} has been verified !`}
            }
        } catch (e) {
            // TODO: Error logging

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }

    }

    async function resendEmail(httpRequest) {

        const logInfo = logging(httpRequest);

        try {
            const {userEmail: email} = httpRequest.params;

            const updatedUser = await userService.resendEmail({email});

            if (updatedUser.message) {

                logInfo.status = 404;
                logInfo.message = `${updatedUser.message}`;
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await logService.createLog({logInfo});

                return {statusCode: 404, body: {...updatedUser}}
            }

            if  (env.NODE_ENV === 'production') {
                sendMail(updatedUser.findUser.email, updatedUser.key.randomKey);
            }

            logInfo.status = 200;
            logInfo.message = `A verification email has been resent to ${updatedUser.findUser.email}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            return {
                statusCode: 200,
                body: {
                    success: true,
                    message: "A verification email has been resent to "
                        + updatedUser.findUser.email
                }
            }
        } catch (e) {

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await logService.createLog({logInfo});

            console.log(e);
            return {statusCode: 400, body: {error: e.message}}
        }
    }
};
