const {roles} = require('./roles');

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);

            if (!permission.granted) {
                return res.status(403).json({
                    message: "You don't have enough permission to perform this action"
                });
            }

            if ((action === 'readOwn' || action === 'updateOwn' || action === 'deleteOwn') &&
                (req.user._id).toString() !==
                (req.params.userId).toString() && req.user.role !== 'admin' &&
                req.user.role !== 'teacher') {
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

module.exports = {
    grantAccess
};
