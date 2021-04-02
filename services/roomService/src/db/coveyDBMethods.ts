import * as Mongoose from 'mongoose';
import {IUser, IUserResponse, IUserLoginRequest, IUserDocument} from '../types/IUser';
import { UserModel } from '../models/userSchema';
import User from '../types/user';
import { RoomLogin } from '../types/payloads';
import HistoryModel from '../models/historySchema';


export async function newUserRegistration(newUser: User): Promise<IUserResponse> {
  const retrivedResult = await UserModel.findOne({emailId: newUser.emailId});
  if (retrivedResult) {
    throw Error('User is already registered');
  }
  try {
    const createRequest = new UserModel({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,   
      creationDate: new Date().toLocaleString('en-US'),
    });
    const createResponse = await createRequest.save();
    return {
      name: createResponse.name,
      creationDate: createResponse.creationDate,
      emailId: createResponse.emailId,
    };
  } catch (err) {
    console.log(err);
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

export async function loginHistory(loginDetails: RoomLogin): Promise<RoomLogin> {
  try {
    console.log(loginDetails);
    const createRequest = new HistoryModel({
      emailId: loginDetails.emailId,
      userName: loginDetails.userName,
      loginDate: new Date().toLocaleString('en-US'),
      friendlyName: loginDetails.friendlyName,
      coveyTownId: loginDetails.coveyTownID,
    });

    const createResponse = await createRequest.save();
    return createResponse;
  } catch (err) {
    return err;
  }
}
