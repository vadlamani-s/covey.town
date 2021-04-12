import cookieParser from 'cookie-parser';
import CORS from 'cors';
import { Express, json, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
// import { OAuth2Client } from 'google-auth-library';
import { sign, verify } from 'jsonwebtoken';
import {
  userLoginRequestHandler,
  userLogoutRequestHandler,
  userProfileDeleteHandler,
  userProfileRequestHandler,
  userProfileUpdateHandler,
  userRegistrationRequestHandler,
} from '../requestHandlers/UserAuthRequestHandler';
import { Credentials } from '../types/IUser';
import { logError } from '../Utils';

const router = Router();
const uiServerOrigin = process.env.UI_SERVER_ORIGIN || 'http://localhost:3000';
router.use(CORS({ origin: uiServerOrigin, credentials: true }));
const { JWT_SECRET } = process.env;

export function addAuthRoutes(app: Express): void {
  app.use(cookieParser());
  app.use('/auth', router);

  /*
   * Create a new user
   */
  router.post('/registerUser', json(), async (req, res) => {
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
  router.post('/loginUser', json(), async (req, res) => {
    try {
      const response = await userLoginRequestHandler({
        emailId: req.body.emailId,
        password: req.body.password,
      });

      if (response.isOK) {
        const { response: loginResponse } = response;
        const credentials: Credentials = {
          signedIn: true,
          name: loginResponse?.name,
          emailId: loginResponse?.emailId,
          creationDate: loginResponse?.creationDate,
        };

        const token = sign(credentials, JWT_SECRET as string);
        /* Uncomment below line so that it works on your localhost and comment the line next to it */
        // res.cookie('jwt', token, { httpOnly: true });
        /* This following line is critical for production phase, uncomment this line while deploying */
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'none', secure: true }); // Critical line needed in production phase
        const response1 = {
          isOK: true,
          response: {
            credentials,
          },
        };
        res.status(StatusCodes.OK).json(response1);
      } else {
        res.status(StatusCodes.OK).json(response);
      }
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
  router.post('/logoutUser', json(), async (req, res) => {
    try {
      const result = await userLogoutRequestHandler(req.cookies.jwt);
      res.clearCookie('jwt');
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  router.patch('/updateUser/:emailId', json(), async (req, res) => {
    try {
      const result = await userProfileUpdateHandler({
        name: req.body.name,
        password: req.body.password,
        emailId: req.params.emailId,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  router.delete('/deleteUser/:emailId/:password', json(), async (req, res) => {
    try {
      const result = await userProfileDeleteHandler({
        emailId: req.params.emailId,
        password: req.params.password,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });
}

/**
 * Fetches user profile information
 */
router.get('/userProfile/:emailId', json(), async (req, res) => {
  try {
    const result = await userProfileRequestHandler({
      emailId: req.params.emailId,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (err) {
    logError(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error, please see log in server for more details',
    });
  }
});

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
