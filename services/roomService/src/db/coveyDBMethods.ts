import bcrypt from 'bcryptjs';
import HistoryModel from '../models/historySchema';
import { generateHash, UserModel } from '../models/userSchema';
import {
  IUserLoginRequest,
  IUserProfileRequest,
  IUserProfileResponse,
  IUserResponse,
  IUserUpdateRequest,
} from '../types/IUser';
import { RoomLogin } from '../types/payloads';
import User from '../types/User';

export default class DBMethods {
  static async newUserRegistration(newUser: User): Promise<IUserResponse> {
    const retrivedResult = await UserModel.findOne({ emailId: newUser.emailId });
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
      return err;
    }
  }

  static async userLogin(user: IUserLoginRequest): Promise<IUserResponse> {
    const retrivedResult = await UserModel.findOne({ emailId: user.emailId });
    if (!retrivedResult) {
      throw Error('Email or Password Incorrect');
    }
    const isMatch = await bcrypt.compare(user.password, retrivedResult.password);
    if (!isMatch) {
      throw Error('Email or Password Incorrect');
    }

    return {
      name: retrivedResult.name,
      creationDate: retrivedResult.creationDate,
      emailId: retrivedResult.emailId,
    };
  }

  static async loginHistory(loginDetails: RoomLogin): Promise<RoomLogin> {
    try {
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

  static async userProfile(user: IUserProfileRequest): Promise<IUserProfileResponse> {
    try {
      const retrivedResult = await UserModel.findOne({ emailId: user.emailId });
      console.log(retrivedResult);
      return {
        name: retrivedResult.name,
        creationDate: retrivedResult.creationDate,
        emailId: retrivedResult.emailId,
        password: retrivedResult.password,
      };
    } catch (err) {
      return err;
    }
  }

  static async getAllLogs(email: string): Promise<RoomLogin[]> {
    const retrievedLogs = await HistoryModel.find({ emailId: email });
    return retrievedLogs;
  }

  static async updateUserRegistration(user: IUserUpdateRequest): Promise<void> {
    try {
      await UserModel.updateOne(
        { emailId: user.emailId },
        {
          $set: {
            name: user.name,
            password: generateHash(user.password),
          },
        },
      );
    } catch (err) {
      throw Error('User not registered');
    }
  }

  static async deleteUserRegistration(user: IUserLoginRequest): Promise<void> {
    const retrivedResult = await UserModel.findOne({ emailId: user.emailId });
    if (!retrivedResult) {
      throw Error('User is not registered');
    }
    const isMatch = await bcrypt.compare(user.password, retrivedResult.password);
    if (!isMatch) {
      throw Error('Incorrect password');
    }
    await UserModel.deleteOne({
      emailId: user.emailId,
    });
  }
}
