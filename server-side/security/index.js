import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import makePasswordFactory from './password'
import authenticateUser from './passport'
import makeJwtFactory from './jwt'
import makeRandomKeyFactory from './email-key'

const passwordFactory = makePasswordFactory({bcrypt});
const jwtFactory = makeJwtFactory({jwt});
const randomKeyFactory = makeRandomKeyFactory({crypto});

export {passwordFactory, authenticateUser, jwtFactory, randomKeyFactory}
