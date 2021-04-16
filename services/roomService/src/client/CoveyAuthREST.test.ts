import bcrypt from 'bcryptjs';
import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import DBMethods from '../db/coveyDBMethods';
import addAuthRoutes from '../router/auth';
import { Credentials, IUserLoginRequest, IUserUpdateRequest } from '../types/IUser';
import User from '../types/User';
import TownsServiceClient from './TownsServiceClient';
import * as AuthHandlers from '../requestHandlers/UserAuthRequestHandler';
import DummyDB from '../lib/DummyDB';
import Validate from '../types/Validate';

jest.mock('../db/coveyDBMethods');
jest.mock('../types/Validate');

const mockValidateAPI = jest.fn();

Validate.validateAPIRequest = mockValidateAPI;

mockValidateAPI.mockImplementation(() => {
  const mockCredentials: Credentials = {
    signedIn: true,
  };
  return mockCredentials;
});

jest.mock('bcryptjs');

const dummyUser = new User('Test 1', 'test1@email.com', '123123123');
const dummyDB = new DummyDB(dummyUser);

const mockNewUserRegistration = jest.fn();
DBMethods.newUserRegistration = mockNewUserRegistration;
mockNewUserRegistration.mockImplementation((newUser: User) => {
  if (!dummyDB.getUserById(newUser.emailId)) {
    dummyDB.newUser = newUser;
  }
  return {
    name: newUser.name,
    creationDate: new Date(),
    emailId: newUser.emailId,
  };
});

const mockUserProfileRequest = jest.fn();
DBMethods.userProfile = mockUserProfileRequest;
mockUserProfileRequest.mockImplementation((requestData: AuthHandlers.UserProfileRequest) =>
  dummyDB.getUserById(requestData.emailId),
);

const mockUserUpdate = jest.fn();
DBMethods.updateUserRegistration = mockUserUpdate;
mockUserUpdate.mockImplementation((updateData: IUserUpdateRequest) => {
  dummyDB.updateUser = updateData;
  return {
    emailId: updateData.emailId,
  };
});

const mockDeleteUser = jest.fn();
DBMethods.deleteUserRegistration = mockDeleteUser;
mockDeleteUser.mockImplementation((userData: IUserLoginRequest) => {
  dummyDB.deleteUserById(userData.emailId);
});

const mockCompare = jest.fn();
bcrypt.compare = mockCompare;
mockCompare.mockImplementation((retrievedPassword, password) => password === retrievedPassword);

const mockHash = jest.fn();
bcrypt.hashSync = mockHash;
mockHash.mockImplementation(pass => pass);

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
    
    it('User profile', async () => {
      const result = await apiClient.userProfile({
        emailId: 'test1@email.com',
      });
      if (result.emailId) {
        expect(result.emailId).toBe('test1@email.com');
        expect(result.name).toBe('Test 1');
      } else {
        fail();
      }
    });

    it('Update profile', async () => {
      await apiClient.updateProfile({
        emailId: 'test1@email.com',
        name: 'test1',
        password: '123123123',
      });
      const result = await apiClient.userProfile({
        emailId: 'test1@email.com',
      });
      if (result.emailId) {
        expect(result.emailId).toBe('test1@email.com');
        expect(result.name).toBe('test1');
      } else {
        fail();
      }
    });

    it('Update profile fail due to invalid emailId', async () => {
      try {
        await apiClient.updateProfile({
          emailId: '',
          name: 'test1',
          password: '123123123',
        });
        fail();
      } catch (err) {
      // should be here
      }
    });

    it('Update profile fail due to invalid password', async () => {
      try {
        await apiClient.updateProfile({
          emailId: 'test1@email.com',
          name: 'test1',
          password: '',
        });
        fail();
      } catch (err) {
        expect(err.response.data.message).toBe('Verify password before updating');
      }
    });

    it('Delete profile', async () => {
      try {
        const newUser = new User('test2', 'test2@email.com', '123123123');
        await apiClient.registerUser({
          name: newUser.name,
          emailId: newUser.emailId,
          password: newUser.password,
        });
        await apiClient.deleteProfile({
          emailId: 'test2@email.com',
          password: '123123123',
        });
        await apiClient.userProfile({
          emailId: 'test2@email.com',
        });
        fail();
      } catch (err) {
        expect(err.message).toBe('Error processing request: User not found');
      }
    });

    it('Delete profile failed due to invalid password', async () => {
      try {
        const newUser = new User('test2', 'test2@email.com', '123123123');
        await apiClient.registerUser({
          name: newUser.name,
          emailId: newUser.emailId,
          password: newUser.password,
        });
        await apiClient.deleteProfile({
          emailId: 'test2@email.com',
          password: 'adsa1',
        });
        fail();
      } catch (err) {
        expect(err.response.data.message).toBe('Verify password before deleting');
      }
    });

  });
});
