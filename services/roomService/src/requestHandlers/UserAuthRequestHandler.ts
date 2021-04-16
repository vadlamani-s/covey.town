import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import DBMethods from '../db/coveyDBMethods';
import { generateHash } from '../models/userSchema';
import { IUserLoginRequest, IUserUpdateRequest } from '../types/IUser';
import User from '../types/User';

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
 * Payload sent by client to request user's profile in Covey.Town
 */
export interface UserProfileRequest {
  emailId: string;
}

/**
 * Response from the server for user profile response
 */
export interface UserProfileResponse {
  emailId: string;
  password: string;
  name: string;
  creationDate: Date;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export async function userRegistrationRequestHandler(
  requestData: UserRegisterRequest,
): Promise<ResponseEnvelope<UserResponse>> {
  const newUser = new User(
    requestData.name,
    requestData.emailId,
    generateHash(requestData.password),
  );
  try {
    await DBMethods.userProfile({ emailId: newUser.emailId });
    return {
      isOK: false,
      message: 'User is already registered',
    };
  } catch (err) {
    try {
      const registrationResponse = await DBMethods.newUserRegistration(newUser);
      return {  
        isOK: true,
        response: {
          name: registrationResponse.name,
          emailId: registrationResponse.emailId,
          creationDate: registrationResponse.creationDate,
        },
      };
    } catch (err1) {
      return err;
    }
  }
}

export async function userLoginRequestHandler(
  requestData: UserLoginRequest,
): Promise<ResponseEnvelope<UserResponse>> {
  try {
    const retrievedUserData = await DBMethods.userProfile({ emailId: requestData.emailId });
    const isMatch = await bcrypt.compare(requestData.password, retrievedUserData.password);
    if (!isMatch) {
      throw Error('Email or Password Incorrect');
    }
    // const loginResponse = await DBMethods.userLogin(requestData);
    return {
      isOK: true,
      response: {
        name: retrievedUserData.name,
        emailId: retrievedUserData.emailId,
        creationDate: retrievedUserData.creationDate,
      },
    };
  } catch (err) {
    return {
      isOK: false,
      message: 'Login failed, Incorrect Email or Password',
    };
  }
}

export async function userLogoutRequestHandler(
  userSessionData: string,
): Promise<ResponseEnvelope<Record<string, null>>> {
  const logoutSuccess = !!userSessionData;
  return {
    isOK: logoutSuccess,
    response: {},
    message: !logoutSuccess ? 'Logout failed' : 'Logout Successful',
  };
}

/**
 * A handler to process a clinet's request to get user's information. The flow is:
 *  1. Client makes a user profile request, this handler is executed
 *  2. Client uses the user information returned by this handler to display the profile information,
 * @param requestData user profile request
 * @returns user profile response
 */
export async function userProfileRequestHandler(
  requestData: UserProfileRequest,
): Promise<ResponseEnvelope<UserProfileResponse>> {
  try {
    const UserProfileResponse = await DBMethods.userProfile(requestData);
    return {
      isOK: true,
      response: {
        name: UserProfileResponse.name,
        emailId: UserProfileResponse.emailId,
        creationDate: UserProfileResponse.creationDate,
        password: UserProfileResponse.password,
      },
    };
  } catch (err) {
    return {
      isOK: false,
      message: 'User not found',
    };
  }
}

export async function userProfileUpdateHandler(
  userUpdateData: IUserUpdateRequest,
): Promise<ResponseEnvelope<void>> {
  try {
    await DBMethods.updateUserRegistration(userUpdateData);
    return {
      isOK: true,
      message: 'Field Updated',
    };
  } catch (err) {
    return {
      isOK: false,
      message: `Update failed !! ${err.message}`,
    };
  }
}

export async function userProfileDeleteHandler(
  userDeleteData: IUserLoginRequest,
): Promise<ResponseEnvelope<void>> {
  try {
    const retrievedUserData = await DBMethods.userProfile({ emailId: userDeleteData.emailId });
    const isMatch = await bcrypt.compare(userDeleteData.password, retrievedUserData.password);
    if (!isMatch) {
      throw Error('Incorrect password');
    }
    await DBMethods.deleteUserRegistration(userDeleteData);
    return {
      isOK: true,
      message: 'User Deleted',
    };
  } catch (err) {
    return {
      isOK: false,
      message: `Delete failed !!| ${err}`,
    };
  }
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
// //}
//
