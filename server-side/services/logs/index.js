import makeAddLogService from './create-log'
import makeEditLogService from './edit-log'
import makeListLogsService from './list-logs'
import {logsRepository} from '../../repository'

const addLogService = makeAddLogService({logsRepository});
const editLogService = makeEditLogService({logsRepository});
const getAllLogService = makeListLogsService({logsRepository});

const logsService = Object.freeze({
    addLogService, editLogService, getAllLogService
});

export default logsService
export {addLogService, editLogService, getAllLogService}
