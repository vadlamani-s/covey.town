import bcrypt from 'bcryptjs';
import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import DBMethods from '../db/coveyDBMethods';
import addAuthRoutes from '../router/auth';
import { IUserLoginRequest, IUserUpdateRequest } from '../types/IUser';
import User from '../types/User';
import TownsServiceClient from './TownsServiceClient';
import * as AuthHandlers from '../requestHandlers/UserAuthRequestHandler';

jest.mock('../db/coveyDBMethods');
jest.mock('bcryptjs');

// const mockLogin = jest.fn();
// DBMethods.userLogin = mockLogin;
// mockLogin.mockImplementation((user: UserLoginRequest) => ({
//   name: '',
//   emailId: user.emailId,
//   creationDate: new Date(),
// }));

const mockNewUserRegistration = jest.fn();
DBMethods.newUserRegistration = mockNewUserRegistration;
mockNewUserRegistration.mockImplementation((newUser: User) => ({
  name: newUser.name,
  creationDate: new Date(),
  emailId: newUser.emailId,
}));

const mockUserProfileRequest = jest.fn();
DBMethods.userProfile = mockUserProfileRequest;
mockUserProfileRequest.mockImplementation((requestData: AuthHandlers.UserProfileRequest) => ({
  emailId: requestData.emailId,
  name: 'xyz',
}));

const mockUserUpdate = jest.fn();
DBMethods.updateUserRegistration = mockUserUpdate;
mockUserUpdate.mockImplementation((updateData: IUserUpdateRequest) => ({
  emailId: updateData.emailId,
}));

const mockDeleteUser = jest.fn();
DBMethods.deleteUserRegistration = mockDeleteUser;
mockDeleteUser.mockImplementation((userData: IUserLoginRequest) => ({
  emailId: userData.emailId,
}));

const mockCompare = jest.fn();
bcrypt.compare = mockCompare;
mockCompare.mockImplementation((retrievedPassword, password) => password === retrievedPassword);

const mockHash = jest.fn();
bcrypt.hashSync = mockHash;
mockHash.mockImplementation((pass) => pass);


describe('TownsServiceAPIREST', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;

  beforeAll(async () => {
    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addAuthRoutes(app);
    server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  afterAll(async () => {
    server.close();
  });
  describe('CoveyTownCreateAPI', () => {
    it('Registers New User', async () => {
      const newUser = new User('xyz', 'xyz@gmail.com', '1234567890');
      mockUserProfileRequest.mockImplementationOnce(() => {
        throw Error();
      });
      const result = await apiClient.registerUser({
        name: newUser.name,
        emailId: newUser.emailId,
        password: newUser.password,
      });

      if (result.emailId) {
        expect(result.emailId).toBe('xyz@gmail.com');
        expect(result.name).toBe('xyz');
      } else {
        fail();
      }
    });
    // it('Fetch all logs', async () => {
    //   const loginResult = await apiClient.loginUser({
    //     emailId: 'xyz@gmail.com',
    //     password: '1234567890',
    //   });
    //   console.log(loginResult);
    //   const result = await apiClient.fetchLogs();
    //   console.log(result);
    //   // if (result) {
    //   //   expect(result.emailId).toBe('xyz@gmail.com');
    //   //   expect(result.name).toBe('xyz');
    //   // } else {
    //   //   fail();
    //   // }
    // });
    it('User profile', async () => {
      const result = await apiClient.userProfile({
        emailId: 'xyz@gmail.com',
      });
      if (result.emailId) {
        expect(result.emailId).toBe('xyz@gmail.com');
        expect(result.name).toBe('xyz');
      } else {
        fail();
      }
    });

    it('Update profile', async () => {
      await apiClient.updateProfile({
        emailId: 'xyz@gmail.com',
        name: 'xyza',
        password: '12345678901',
      });
    });

  });
});
