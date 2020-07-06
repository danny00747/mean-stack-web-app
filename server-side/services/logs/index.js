import makeAddLogService from './create-log'
import makeEditLogService from './edit-log'
import {logsRepository} from '../../repository'

const addLogService = makeAddLogService({logsRepository});
const editLogService = makeEditLogService({logsRepository});

const logsService = Object.freeze({
    addLogService, editLogService
});

export default logsService
export {addLogService, editLogService}
