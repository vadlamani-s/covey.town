import * as Mongoose from 'mongoose';
import {IUser, IUserResponse, IUserLoginRequest} from '../types/IUser';
import { UserModel } from '../models/userSchema';
import User from '../types/user';

// let database: Mongoose.Connection;


// export const disconnect = () => {
//   if (!database) {
//     return;
//   }
//   Mongoose.disconnect();
// };

export async function newUserRegistration(newUser: User): Promise<IUserResponse> {
  const retrivedResult = await UserModel.findOne({emailId: newUser.emailId}) as IUser;
  if (retrivedResult) {
    throw new Error('User is already registered');
  }

  try {
    const createResponse =  UserModel.create({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,   
      creationDate: new Date(),
    }) as Promise<IUser>;
    
  } catch (err) {
    return err;
  }
  return {
    name: newUser.name,
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



