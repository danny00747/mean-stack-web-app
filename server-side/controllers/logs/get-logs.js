export default function makeGetLogsController({getAllLogService}) {
    return async (httpRequest) => {

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
