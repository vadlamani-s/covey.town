import * as Mongoose from 'mongoose';
import {IUser, IUserResponse, IUserLoginRequest, IUserDocument} from '../types/IUser';
import { UserModel } from '../models/userSchema';
import User from '../types/user';

// export const disconnect = () => {
//   if (!database) {
//     return;
//   }
//   Mongoose.disconnect();
// };

export async function newUserRegistration(newUser: User): Promise<IUserResponse> {
  const retrivedResult = UserModel.findOne({emailId: newUser.emailId}) as IUser;
  if (retrivedResult) {
    throw Error('User is already registered');
  }

  try {
    const createResponse = await UserModel.create({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,   
      creationDate: new Date().toLocaleString('en-US'),
    });

    return {
      name: createResponse.name,
      creationDate: createResponse.creationDate,
      emailId: createResponse.emailId,
    };
  } catch (err) {
    return err;
  }
}

export async function userLogin(user: IUserLoginRequest): Promise<IUserResponse> {
  const retrivedResult = await UserModel.findOne({emailId: user.emailId});
  if (!retrivedResult) {
    throw Error('Email or Password Incorrect');
  }

  const isMatch = await retrivedResult.comparePassword(user.password);
  if (!isMatch) {
    throw Error('Email or Password Incorrect');
  }

  return {
    name: retrivedResult.name,
    creationDate: retrivedResult.creationDate,
    emailId: retrivedResult.emailId,
  };
}

