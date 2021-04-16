import { Document, Model} from 'mongoose';

export interface IUser {
  name: string;
  emailId: string;
  password: string;
  creationDate: Date;
}

export interface IUserResponse {
  name: string;
  emailId: string;
  creationDate: Date;
}

/**
 * Payload sent by the client for user's profile
 */
export interface IUserProfileRequest {
  emailId: string;
}

/**
 * Response sent by the server for the user profile request
 */
export interface IUserProfileResponse {
  name: string;
  emailId: string;
  creationDate: Date;
  password: string;
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface IUserLoginRequest {
  emailId: string;
  password: string;
}

export interface Credentials {
  signedIn: boolean,
  name?: string,
  emailId?: string,
  creationDate?: Date,
}

export interface IUserUpdateRequest {
  name: string;
  password: string;
  emailId: string;
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
