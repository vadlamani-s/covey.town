import { Document, Model } from 'mongoose';

export interface IUser {
  // [x: string]: any;
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

export interface IUserProfileResponse {
  name: string;
  emailId: string;
  creationDate: Date;
  password: string;
}

export interface IUserProfileRequest {
  emailId: string;
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

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
