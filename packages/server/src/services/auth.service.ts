import asyncMiddleware from "middleware-async";
import { findOneEntity } from "../utils/find-one-entity.util";
import { DI } from "../app";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../utils/classes/error.class.util";
import { compare, hash } from "bcrypt";
import * as jwt from 'jsonwebtoken'
import * as Constants from '../constants'
import { User } from "../entities";
import { validateDto } from "../utils/validate-dto.util";
import { RegisterDto } from "../dtos/register.dto";
import { caseInsensitiveRegex } from "../utils/case-insensitive-regex";


require('dotenv').config({
  path : Constants.envPath
});

async function findUser(usernameOrEmail : string){
  return await findOneEntity(DI.repository.users, {
    $or : [
      { username : caseInsensitiveRegex(usernameOrEmail) },
      { email : caseInsensitiveRegex(usernameOrEmail) }
    ]
  });
}

export const authService = {

  register : asyncMiddleware(async (req, res) => {
    const { username : _username, password, email : _email } = await validateDto(req, RegisterDto);
    const username = _username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const email = _email.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

    const user = await findOneEntity(DI.repository.users, { username : caseInsensitiveRegex(username) });
    if (user) {
      throw new BadRequestError("User already exists");
    }
    const userByEmail = await findOneEntity(DI.repository.users, { email : caseInsensitiveRegex(email) } );
    if (userByEmail) {
      throw new BadRequestError("Email already exists");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new User({
      password : hashedPassword,
      username,
      email,
    })
    await DI.em.persistAndFlush(newUser);

    return res.json({
      message : "User created successfully"
    });
  }),

  login : asyncMiddleware(async (req, res) => {
    const { username : _username, password } = req.body;
    if (!_username || !password) {
      throw new BadRequestError("Invalid username or password");
    }
    const username = _username.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const user = await findUser(username);
    if (!user) {
      throw new UnauthorizedError();
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError();
    }
  
    const accessToken = jwt.sign({ 
      id : user.id,
      username : user.username,
      isAdmin : user.isAdmin
     }, process.env.JWT_SECRET!, {
      expiresIn : '1h',
    });

    const refreshToken = jwt.sign({
      id : user.id,
      username : user.username,
      isAdmin : user.isAdmin
    }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn : '7d'
    });
 
    user.refreshToken = refreshToken;
    await DI.em.flush();

    return res.json({
      accessToken,
      refreshToken
    });
  }),

  jwtAuth : (options : {
    adminOnly ?: boolean,
    loginOptional ?: boolean
  } = {})=>asyncMiddleware(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      throw new BadRequestError("Token is required");
    }
    try {
      const decoded = jwt.verify(token.replace(
        'Bearer ', ''
      ), process.env.JWT_SECRET!) as jwt.JwtPayload as {
        id : number,
        username : string,
        isAdmin : boolean
      };
      
      if (options.adminOnly && !decoded.isAdmin)
        throw new ForbiddenError();

      req.user = decoded;
      next();
    } catch (error) {
      if(options.loginOptional)
        return next();
      
      throw new UnauthorizedError();
    }
  }),

  refresh : asyncMiddleware(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new BadRequestError("Invalid token");
    }
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
      const user = await findOneEntity(DI.repository.users, { id : decoded.id });
      if (!user) {
        throw new UnauthorizedError();
      }
      if(user.refreshToken !== refreshToken){
        throw new UnauthorizedError();
      }
      const accessToken = jwt.sign({
        id : user.id,
        username : user.username,
        isAdmin : user.isAdmin
      }, process.env.JWT_SECRET!, {
        expiresIn : '1h'
      });
      return res.json({
        accessToken
      });
    } catch (error) {
      throw new UnauthorizedError();
    }
  })
}