import { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import BodyParser, { json } from 'body-parser';

import { logError } from '../Utils';
import {
  userRegistrationRequestHandler,
  userLoginRequestHandler,
  userLogoutRequestHandler,
} from '../requestHandlers/UserAuthRequestHandler';

export default function addAuthRoutes(app: Express): void {
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
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

  /*
   * Login user
   */
  app.post('/loginUser', BodyParser.json(), async (req, res) => {
    try {
      const result = await userLoginRequestHandler({
        emailId: req.body.emailId,
        password: req.body.password,
      });
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
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
      res.status(StatusCodes.OK)
        .json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: 'Internal server error, please see log in server for more details',
        });
    }
  });

}


// export default { routes, validateAPIRequest };
