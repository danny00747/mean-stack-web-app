export default function makeSignInUserController({logInUserService, bcrypt, jwt, addLogService}) {
    return async (httpRequest) => {

        const logInfo = {
            level: 'info', requestId: httpRequest.id, ip: httpRequest.ip,
            url: httpRequest.url, host: httpRequest.host, method: httpRequest.method
        };

        try {
            const {...userInfo} = httpRequest.body;

            const existing = await logInUserService({
                ...userInfo,
            });

            if (existing.length === 0) {

                logInfo.status = 401;
                logInfo.message = 'Authentication failed !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 401,
                    body: {success: false, message: "Authentication failed !"}
                };
            }


            const [{username, role, email, score, password, _id: id}] = existing;

            if (await bcrypt.compare(userInfo.password, password)) {

                const jwtToken = jwt.sign({email: email, userId: id},
                    process.env["JWT_KEY"], {expiresIn: "1h"}
                );

                logInfo.status = 200;
                logInfo.message = 'Authentication successful !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 200,
                    body: {
                        success: true, token: "JWT " + jwtToken,
                        user: {
                            userId: id,
                            username: username,
                            userEmail: email,
                            role: role,
                            score: score
                        }
                    },
                }
            } else {

                logInfo.status = 401;
                logInfo.message = 'Authentication failed !';
                logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
                await addLogService(logInfo);

                return {
                    statusCode: 401,
                    body: {success: false, message: "Authentication failed !"}
                }
            }

        } catch (e) {
            // TODO: Error logging

            logInfo.status = 400;
            logInfo.level = "error";
            logInfo.message = `${e}`;
            logInfo.response = `Outgoing ${logInfo.method} request to ${logInfo.url}`;
            await addLogService(logInfo);

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
