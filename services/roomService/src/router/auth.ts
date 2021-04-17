import assert from 'assert';
import cookieParser from 'cookie-parser';
import CORS from 'cors';
import { Express, json, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import {
  userLoginRequestHandler,
  userLogoutRequestHandler,
  userProfileDeleteHandler,
  userProfileRequestHandler,
  userProfileUpdateHandler,
  userRegistrationRequestHandler,
} from '../requestHandlers/UserAuthRequestHandler';
import { Credentials } from '../types/IUser';
import Validate from '../types/Validate';
import { logError } from '../Utils';

const router = Router();
const uiServerOrigin = process.env.UI_SERVER_ORIGIN || 'http://localhost:3000';
router.use(CORS({ origin: uiServerOrigin, credentials: true }));
const { JWT_SECRET } = process.env;

export default function addAuthRoutes(app: Express): void {
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

  interface LoginResponse {
    isOk: boolean;
    token?: string;
    credentials?: Credentials;
    message?: string;
  }

  async function validateUser(emailId: string, password: string): Promise<LoginResponse> {
    const response = await userLoginRequestHandler({
      emailId,
      password,
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
      return { isOk: response.isOK, token, credentials };
    }
    return { isOk: response.isOK, message: response.message };
  }

  /*
   * Login User
   */
  router.post('/loginUser', json(), async (req, res) => {
    try {
      const response = await validateUser(req.body.emailId, req.body.password);
      if (response.isOk) {
        res.cookie('jwt', response.token, { httpOnly: true, sameSite: 'none', secure: true }); 
        const response1 = {
          isOK: true,
          response: {
            credentials: response.credentials,
          },
        };
        res.status(StatusCodes.OK).json(response1);
        return;
      }
      res.status(400).json(response);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /*
   * Logout User
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

  /*
   * Update User profile
   */
  router.patch('/updateUser/:emailId', json(), async (req, res) => {
    try {
      const userCredentials = Validate.validateAPIRequest(req.cookies.jwt) as Credentials;
      assert(userCredentials.signedIn);
      const validateResponse = await validateUser(req.body.emailId, req.body.password);
      assert(validateResponse.isOk);
    } catch (err) {
      res.status(400).json({ message: 'Verify password before updating' });
      return;
    }
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

  /*
   * Delete User profile
   */
  router.delete('/deleteUser/:emailId/:password', json(), async (req, res) => {
    try {
      const userCredentials = Validate.validateAPIRequest(req.cookies.jwt) as Credentials;
      assert(userCredentials.signedIn);
      const validateResponse = await validateUser(req.params.emailId, req.params.password);
      assert(validateResponse.isOk);
    } catch (err) {
      res.status(400).json({ message: 'Verify password before deleting' });
      return;
    }
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

  /**
   * Fetches user profile information
   */
  router.post('/userProfile', json(), async (req, res) => {
    try {
      const userCredentials = Validate.validateAPIRequest(req.cookies.jwt) as Credentials;
      assert(userCredentials.signedIn);
    } catch (err) {
      res.status(StatusCodes.OK).json({ message: 'Invalid Request' });
    }
    try {
      const result = await userProfileRequestHandler({
        emailId: req.body.emailId,
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
