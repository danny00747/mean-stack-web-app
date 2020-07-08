export default function makeListLogsService({logsRepository}) {
    return async (max) => {

        if (!(Number.isInteger(Number(max))))
            throw new Error('The max limit must an intger.');

        const total = await logsRepository.findMax();

        if (Number(max) > total)
            throw new RangeError(`There are ${total} logs available in database !`);

        return [{totalLogs: total}, await logsRepository.findAll(max)]
    }
}
