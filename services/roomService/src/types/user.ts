import { Document, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: Date;
  password: string;
  creationDate?: Date;
}

export interface IUserDocument extends IUser, Document {}
export type IUserModel = Model<IUserDocument>;
