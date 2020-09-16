import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import routes from './server-side/routes'
import helmet from 'helmet';
import env from './server-side/config/environment'
import appBuilder from "./server-side";
const addRequestId = require('express-request-id')();

const server = new appBuilder();
server
    .initDatabase()
    .addMiddleware(cors())
    .addMiddleware(bodyParser.json())
    .addMiddleware(addRequestId)
    .helmetSecurity(helmet)
    .passportConfig(passport)
    .serveStaticFiles()
    .addRouting(routes)
    .errorHandler()
    .listenOn(env.PORT ?? 5000);

export default server.run();
