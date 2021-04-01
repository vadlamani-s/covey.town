import BodyParser from 'body-parser';
import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
// import { OAuth2Client } from 'google-auth-library';
import { sign, verify } from 'jsonwebtoken';
import {
  userLoginRequestHandler,
  userLogoutRequestHandler,
  userRegistrationRequestHandler,
} from '../requestHandlers/UserAuthRequestHandler';
import { Credentials } from '../types/IUser';
import { logError } from '../Utils';

const { JWT_SECRET } = process.env;

export function addAuthRoutes(app: Express): void {
  /*
   * Create a new user
   */
  app.post('/registerUser', BodyParser.json(), async (req, res) => {
    try {
      const result = await userRegistrationRequestHandler({
        name: req.body.name,
        emailId: req.body.emailId,
        password: req.body.password,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /*
   * Login user
   */
  app.post('/loginUser', BodyParser.json(), async (req, res) => {
    try {
      const response = await userLoginRequestHandler({
        emailId: req.body.emailId,
        password: req.body.password,
      });
      const { response: loginResponse } = response;
      const credentials: Credentials = {
        signedIn: true,
        name: loginResponse?.name,
        emailId: loginResponse?.emailId,
        creationDate: loginResponse?.creationDate,
      };

      const token = sign(credentials, JWT_SECRET as string);

      /* Uncomment below line so that it works on your localhost and comment the line next to it */
      res.cookie('jwt', token, { httpOnly: true });
      /* This following line is critical for production phase, uncomment this line while deploying */
      // res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', secure: true }); // Critical line needed in production phase
      res.json(credentials);
      res.status(StatusCodes.OK).json(response);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /*
   * Logout user
   */
  app.post('/logoutUser', BodyParser.json(), async (req, res) => {
    try {
      const result = await userLogoutRequestHandler(req.cookies.userSession);
      res.clearCookie('jwt');
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });
}

export const validateAPIRequest = (validatetoken: string): Credentials => {
  let validatedCredentials: Credentials;
  try {
    validatedCredentials = verify(validatetoken, JWT_SECRET as string) as Credentials;
  } catch (err) {
    validatedCredentials = { signedIn: false };
  }
  return validatedCredentials;
};

// export default { routes, validateAPIRequest };
