import cors from 'cors';
// import { OAuth2Client } from 'google-auth-library';
import { sign, verify, JsonWebTokenError } from 'jsonwebtoken';
import { config } from 'dotenv';
import { json } from 'body-parser';

import User from '../types/User';
import {newUserRegistration, userLogin} from '../db/coveyDBMethods';

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface UserRegisterRequest {
  emailId: string;
  password: string;
  name: string;
  creationDate?: Date;
}
  
/**
   * Response from the server for a Town create request
   */
export interface UserResponse {
  emailId: string;
  name: string;
  creationDate: Date;
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface UserLoginRequest {
  emailId: string;
  password: string;
}
    

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export async function userRegistrationRequestHandler(requestData: UserRegisterRequest): Promise<ResponseEnvelope<UserResponse>> {
  const newUser = new User(requestData.name, requestData.emailId, requestData.password);
  const registrationResponse = await newUserRegistration(newUser);
  return {
    isOK: true,
    response: {
      name: registrationResponse.name,
      emailId: registrationResponse.emailId,
      creationDate: registrationResponse.creationDate,
    },
  };
}

export async function userLoginRequestHandler(requestData: UserLoginRequest): Promise<ResponseEnvelope<UserResponse>> {
  const registrationResponse = await userLogin(requestData);
  return {
    isOK: true,
    response: {
      name: registrationResponse.name,
      emailId: registrationResponse.emailId,
      creationDate: registrationResponse.creationDate,
    },
  };
}

export async function userLogoutRequestHandler(userSessionData: string): Promise<ResponseEnvelope<Record<string, null>>> {
  const logoutSuccess = !userSessionData;
  return {
    isOK: logoutSuccess,
    response: {},
    message: !logoutSuccess ? 'Logout failed' : 'Logout Successful',
  };
}





/* Refer to this link to understand how json web tokens validate the tokens
    https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/

    Refer to this link to understand how routing middleware can be used to authenticate
    https://scotch.io/tutorials/route-middleware-to-check-if-a-user-is-authenticated-in-node-js
*/

config();

// const routes = Router();

// const { JWT_SECRET } = process.env;

// const uiServerOrigin = process.env.UI_SERVER_ORIGIN || 'http://localhost:3000';

// routes.use(cors({ origin: uiServerOrigin, credentials: true }));
// routes.use(json());

// routes.post('/signin', async (req, res) => {
  
//   //   const client = new OAuth2Client();
//   //   const ticket = await client.verifyIdToken({ idToken: req.body.google_tokenId }).catch((e) => res.send(`Invalid Credentials: ${e}`));
//   //   const tokenData = ticket.getPayload();
//   //   const { given_name: givenName, name, email } = tokenData;
//   //   const credentials = {
//   //     signedIn: true,
//   //     givenName,
//   //     name,
//   //     email,
//   //   };
//   //   const token = sign(credentials, JWT_SECRET);
//   //   /* Uncomment below line so that it works on your localhost and comment the line next to it */
//   //   res.cookie('jwt', token, { httpOnly: true });
//   //   /* This following line is critical for production phase, uncomment this line while deploying */
//   //   // res.cookie('jwt', token, { httpOnly: true, sameSite: 'None', secure: true }); // Critical line needed in production phase
//   //   res.json(credentials);
// });

// routes.post('/signout', async (req, res) => {
//   res.clearCookie('jwt');
//   res.json({ status: 'ok' });
// });


// const validateAPIRequest = (req, res): unknown => {
//   const validatetoken = req.cookies.jwt;
//   try {
//     const validatedCredentials = verify(validatetoken, JWT_SECRET as string);
//     console.log(
//       'validated credentials..........................................................................',
//     );
//     return validatedCredentials;
//   } catch (e) {
//     if (e instanceof JsonWebTokenError) {
//       // if the error thrown is because the JWT is unauthorized, return a 401 error
//       return res
//         .status(401)
//         .json({
//           errorMessage: 'Unauthorized Request, please login first to perform the operation',
//         });
//     }
//     // otherwise, return a bad request error
//     return res.status(400).json({ errorMessage: 'Bad Request' });
//   }
// };