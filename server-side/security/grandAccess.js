import {roles} from './roles';

const grantAccess = (action, resource) => {
    return async (req, res, next) => {

        const userIds = req.params.userId ?? req.params.username;

        try {
            const permission = roles.can(req.user.role)[action](resource);

            if (!permission.granted) {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action"
                });
            }

            if ((action === 'readOwn' || action === 'updateOwn' ||
                action === 'createOwn' || action === 'deleteOwn') &&
                (req.user._id).toString() !== userIds.toString() &&
                (req.user.username).toString() !== userIds.toString()
                && req.user.role !== 'admin' && req.user.role !== 'teacher') {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action !"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
};

export default grantAccess
