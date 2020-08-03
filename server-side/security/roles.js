import {AccessControl} from 'accesscontrol';

const ac = new AccessControl();

export const roles = (() => {
    ac.grant("student")
        .createOwn("review")
        .readOwn("profile")
        .updateOwn(["profile", "review"])
        .deleteOwn(["profile", "review"]);

    ac.grant("teacher")
        .extend("student")
        .readAny(["profile", "review"]);

    ac.grant("admin")
        .extend("student")
        .extend("teacher")
        .updateAny(["profile", "review"])
        .deleteAny(["profile", "review"]);

    return ac;
})();
