import {getAllLogService} from '../../services/logs'

import makeGetLogsController from './get-logs';

const getLogsController = makeGetLogsController({getAllLogService});

const logsController = Object.freeze({
    getLogsController
});

export default logsController
export {getLogsController}
