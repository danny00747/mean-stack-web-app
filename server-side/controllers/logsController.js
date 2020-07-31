import {logService} from "../services";
export default function logControllerFactory() {
    return Object.freeze({
        getLogs
    });

    async function getLogs(httpRequest) {

        const {limit} = httpRequest.params;

        try {

            const logs = await logService.listLogs({limit});

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

};
