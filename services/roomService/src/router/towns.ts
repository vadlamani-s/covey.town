import cookieParser from 'cookie-parser';
import { Express, json, Router } from 'express';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import io from 'socket.io';
import {
  meetingLogs,
  storeMeetingRequest,
  townCreateHandler,
  townDeleteHandler,
  townJoinHandler,
  townListHandler,
  townSubscriptionHandler,
  townUpdateHandler,
} from '../requestHandlers/CoveyTownRequestHandlers';
import { Credentials } from '../types/IUser';
import { logError } from '../Utils';
import { validateAPIRequest } from './auth';

const router = Router();

export default function addTownRoutes(http: Server, app: Express): io.Server {
  app.use(cookieParser());
  app.use('/api', router);
  let userCredentials: Credentials;

  router.use('/', (req, res, next) => {
    userCredentials = validateAPIRequest(req.cookies.jwt) as Credentials;
    if (userCredentials.signedIn) {
      next();
    } else {
      res.status(400).json({ message: 'Invalid Request' });
    }
  });

  /*
   * Create a new session (aka join a town)
   */
  router.post('/sessions', json(), async (req, res) => {
    try {
      const result = await townJoinHandler({
        userName: req.body.userName,
        coveyTownID: req.body.coveyTownID,
      });
      const { response: joinResponse } = result;
      let historyResponse = null;
      if (joinResponse?.coveyUserID) {
        historyResponse = await storeMeetingRequest({
          emailId: userCredentials.emailId,
          friendlyName: joinResponse.friendlyName,
          coveyTownID: req.body.coveyTownID,
          userName: req.body.userName,
        });
      }
      if (historyResponse?.isOK === false) {
        res.status(StatusCodes.OK).json(historyResponse.message);
      } else {
        res.status(StatusCodes.OK).json(result);
      }
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Delete a town
   */
  router.delete('/towns/:townID/:townPassword', json(), async (req, res) => {
    try {
      const result = await townDeleteHandler({
        coveyTownID: req.params.townID,
        coveyTownPassword: req.params.townPassword,
      });
      res.status(200).json(result);
    } catch (err) {
      logError(err);
      res.status(500).json({
        message: 'Internal server error, please see log in server for details',
      });
    }
  });

  /**
   * List all towns
   */
  router.get('/towns', json(), async (_req, res) => {
    try {
      const result = await townListHandler();
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });

  /**
   * Create a town
   */
  router.post('/towns', json(), async (req, res) => {
    try {
      const result = await townCreateHandler(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });
  /**
   * Update a town
   */
  router.patch('/towns/:townID', json(), async (req, res) => {
    try {
      const result = await townUpdateHandler({
        coveyTownID: req.params.townID,
        isPubliclyListed: req.body.isPubliclyListed,
        friendlyName: req.body.friendlyName,
        coveyTownPassword: req.body.coveyTownPassword,
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
   * Fetch all the logs for a user
   */
  router.get('/fetchlogs', json(), async (_req, res) => {
    try {
      const result = await meetingLogs({
        emailId: userCredentials.emailId as string,
      });
      res.status(StatusCodes.OK).json(result);
    } catch (err) {
      logError(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error, please see log in server for more details',
      });
    }
  });
  

  const socketServer = new io.Server(http, { cors: { origin: '*' } });
  socketServer.on('connection', townSubscriptionHandler);
  return socketServer;
}
