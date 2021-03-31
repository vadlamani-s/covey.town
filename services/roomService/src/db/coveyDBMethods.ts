import * as Mongoose from 'mongoose';
import {IUser, IUserResponse, IUserLoginRequest} from '../types/IUser';
import { UserModel } from '../models/userSchema';

let database: Mongoose.Connection;

export async function newUserRegistration(newUser: IUserResponse): Promise<IUserResponse> {
  const a = newUser;
  return {
    name: 'dummy',
    creationDate: new Date(),
    emailId: 'aasd@asd.com',
  };
}

export async function userLogin(user: IUserLoginRequest): Promise<IUserResponse> {
  const a = user;
  return {
    name: 'dummy',
    creationDate: new Date(),
    emailId: 'aasd@asd.com',
  };
}



