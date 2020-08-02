import {AccessControl} from 'accesscontrol';

const ac = new AccessControl();

export const roles = (() => {
    ac.grant("student")
        .readOwn("profile")
        .updateOwn("profile")
        .deleteOwn("profile");

    ac.grant("teacher")
        .extend("student")
        .readAny("profile");

    ac.grant("admin")
        .extend("student")
        .extend("teacher")
        .updateAny("profile")
        .deleteAny("profile");

    return ac;
})();
