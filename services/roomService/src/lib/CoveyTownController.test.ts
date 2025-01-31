import bcrypt from 'bcryptjs';
import { mock, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { Socket } from 'socket.io';
import * as TestUtils from '../client/TestUtils';
import { UserLocation } from '../CoveyTypes';
import DBMethods from '../db/coveyDBMethods';
import { townSubscriptionHandler } from '../requestHandlers/CoveyTownRequestHandlers';
import * as AuthHandlers from '../requestHandlers/UserAuthRequestHandler';
import CoveyTownListener from '../types/CoveyTownListener';
import { IUserLoginRequest, IUserUpdateRequest } from '../types/IUser';
import Player from '../types/Player';
import PlayerSession from '../types/PlayerSession';
import User from '../types/User';
import CoveyTownController from './CoveyTownController';
import CoveyTownsStore from './CoveyTownsStore';
import DummyDB from './DummyDB';
import TwilioVideo from './TwilioVideo';

jest.mock('./TwilioVideo');
jest.mock('../db/coveyDBMethods');
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

const mockGetTokenForTown = jest.fn();
// eslint-disable-next-line
// @ts-ignore it's a mock
TwilioVideo.getInstance = () => ({
  getTokenForTown: mockGetTokenForTown,
});

function generateTestLocation(): UserLocation {
  return {
    rotation: 'back',
    moving: Math.random() < 0.5,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
}

/**
 * Login Iser test cases have been written in the CoveyAuthREST file.
 */

describe('Authorization', () => {
  it('New User Registration', async () => {
    const newUser = new User('xyz', 'xyz@gmail.com', '1234567890');
    const result = await AuthHandlers.userRegistrationRequestHandler({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,
    });
    if (result.response) {
      expect(result.response.emailId).toBe('xyz@gmail.com');
      expect(result.response.name).toBe('xyz');
    } else {
      fail();
    }
  });

  it('User already Registered', async () => {
    const newUser = new User('test1', 'test1@gmail.com', '1234567890');
    const result = await AuthHandlers.userRegistrationRequestHandler({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,
    });
    const result1 = await AuthHandlers.userRegistrationRequestHandler({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,
    });

    if (result1.message && result.response) {
      expect(result.response.emailId).toBe('test1@gmail.com');
      expect(result.response.name).toBe('test1');
      expect(result1.message).toBe('User is already registered');
    } else {
      fail();
    }
  });


  it('User failed to Register due to invalid emailId', async () => {
    try {
      const newUser = new User('xyz', 'xyzgmail.com', '1234567890');
      await AuthHandlers.userRegistrationRequestHandler({
        name: newUser.name,
        emailId: newUser.emailId,
        password: newUser.password,
      });
      fail();
    } catch (err) {
      // has to be here
    }
  });


  it('User failed to Register due to invalid password', async () => {
    try {
      const newUser = new User('xyz', 'xyz@gmail.com', '12345');
      await AuthHandlers.userRegistrationRequestHandler({
        name: newUser.name,
        emailId: newUser.emailId,
        password: newUser.password,
      });
      fail();
    } catch (err) {
      // has to be here
    }
  });

  it('User failed to Register due to empty username', async () => {
    try {
      const newUser = new User('', 'xyz@gmail.com', '123456789');
      await AuthHandlers.userRegistrationRequestHandler({
        name: newUser.name,
        emailId: newUser.emailId,
        password: newUser.password,
      });
      fail();
    } catch (err) {
      // has to be here
    }
  });

  it('LogOut', async () => {
    const result = await AuthHandlers.userLogoutRequestHandler('userSession');
    if (result.response) {
      expect(result.message).toBe('Logout Successful');
    } else {
      fail();
    }
  });

  it('LogOut Failed', async () => {
    const result = await AuthHandlers.userLogoutRequestHandler('');
    if (result.response) {
      expect(result.message).toBe('Logout failed');
    } else {
      fail();
    }
  });

  it('User Profile Request', async () => {
    const result = await AuthHandlers.userProfileRequestHandler({
      emailId: 'test1@email.com',
    });
    if (result.response) {
      expect(result.response.emailId).toBe('test1@email.com');
      expect(result.response.name).toBe('Test 1');
    } else {
      fail();
    }
  });

  it('User Profile Request failed due to no User registered', async () => {
    const result = await AuthHandlers.userProfileRequestHandler({
      emailId: 'test2@email.com',
    });
    if (result.message) {
      expect(result.message).toBe('User not found');
    } else {
      fail();
    }
  });


  it('User Profile Update', async () => {
    const result = await AuthHandlers.userProfileUpdateHandler({
      emailId: 'test1@email.com',
      name: 'test1',
      password: '123123123',
    });
    const profileRequest = await AuthHandlers.userProfileRequestHandler({
      emailId: 'test1@email.com',
    });
    if (result.message && profileRequest.response) {
      expect(result.message).toBe('Field Updated');
      expect(profileRequest.response.name).toBe('test1');
    } else {
      fail();
    }
  });

  it('User Profile Update failed due to invalid user name', async () => {
    const result = await AuthHandlers.userProfileUpdateHandler({
      emailId: 'test1@email.com',
      name: '',
      password: '1234567890',
    });
    if (result.message) {
      expect(result.message).toBe('Update failed !! Name field is empty');
    } else {
      fail();
    }
  });

  it('User Profile Update failed due to invalid emailId', async () => {
    const result = await AuthHandlers.userProfileUpdateHandler({
      emailId: 'test2@email.com',
      name: 'test1',
      password: '1234567890',
    });
    if (result.message) {
      expect(result.isOK).toBe(false);
    } else {
      fail();
    }
  });

  it('Delete User Data', async () => {
    const newUser = new User('test3', 'test3@gmail.com', '1234567890');
    await AuthHandlers.userRegistrationRequestHandler({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,
    });
    const deleteResult = await AuthHandlers.userProfileDeleteHandler({
      emailId: 'test3@gmail.com',
      password: '1234567890',
    });
    expect(deleteResult.message).toBe('User Deleted');
  });

  it('Delete User Data after deleting once', async () => {
    const newUser = new User('test4', 'test4@gmail.com', '1234567890');
    await AuthHandlers.userRegistrationRequestHandler({
      name: newUser.name,
      emailId: newUser.emailId,
      password: newUser.password,
    });
    const deleteResult = await AuthHandlers.userProfileDeleteHandler({
      emailId: 'test4@gmail.com',
      password: '1234567890',
    });

    const deleteResult1 = await AuthHandlers.userProfileDeleteHandler({
      emailId: 'test4@gmail.com',
      password: '1234567890',
    });
    expect(deleteResult.message).toBe('User Deleted');
    expect(deleteResult1.isOK).toBe(false);
  });

});

describe('CoveyTownController', () => {
  beforeEach(() => {
    mockGetTokenForTown.mockClear();
  });
  it('constructor should set the friendlyName property', () => {
    // Included in handout
    const townName = `FriendlyNameTest-${nanoid()}`;
    const townController = new CoveyTownController(townName, false);
    expect(townController.friendlyName).toBe(townName);
  });
  describe('addPlayer', () => {
    // Included in handout
    it('should use the coveyTownID and player ID properties when requesting a video token', async () => {
      const townName = `FriendlyNameTest-${nanoid()}`;
      const townController = new CoveyTownController(townName, false);
      const newPlayerSession = await townController.addPlayer(new Player(nanoid()));
      expect(mockGetTokenForTown).toBeCalledTimes(1);
      expect(mockGetTokenForTown).toBeCalledWith(
        townController.coveyTownID,
        newPlayerSession.player.id,
      );
    });
  });
  describe('town listeners and events', () => {
    let testingTown: CoveyTownController;
    const mockListeners = [
      mock<CoveyTownListener>(),
      mock<CoveyTownListener>(),
      mock<CoveyTownListener>(),
    ];
    beforeEach(() => {
      const townName = `town listeners and events tests ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
      mockListeners.forEach(mockReset);
    });
    it('should notify added listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);
      const newLocation = generateTestLocation();
      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.updatePlayerLocation(player, newLocation);
      mockListeners.forEach(listener => expect(listener.onPlayerMoved).toBeCalledWith(player));
    });
    it('should notify added listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.destroySession(session);
      mockListeners.forEach(listener =>
        expect(listener.onPlayerDisconnected).toBeCalledWith(player),
      );
    });
    it('should notify added listeners of new players when addPlayer is called', async () => {
      mockListeners.forEach(listener => testingTown.addTownListener(listener));

      const player = new Player('test player');
      await testingTown.addPlayer(player);
      mockListeners.forEach(listener => expect(listener.onPlayerJoined).toBeCalledWith(player));
    });
    it('should notify added listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.disconnectAllPlayers();
      mockListeners.forEach(listener => expect(listener.onTownDestroyed).toBeCalled());
    });
    it('should not notify removed listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const newLocation = generateTestLocation();
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.updatePlayerLocation(player, newLocation);
      expect(listenerRemoved.onPlayerMoved).not.toBeCalled();
    });
    it('should not notify removed listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerDisconnected).not.toBeCalled();
    });
    it('should not notify removed listeners of new players when addPlayer is called', async () => {
      const player = new Player('test player');

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      const session = await testingTown.addPlayer(player);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerJoined).not.toBeCalled();
    });

    it('should not notify removed listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.disconnectAllPlayers();
      expect(listenerRemoved.onTownDestroyed).not.toBeCalled();
    });
  });
  describe('townSubscriptionHandler', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let session: PlayerSession;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      session = await testingTown.addPlayer(player);
    });
    it('should reject connections with invalid town IDs by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(nanoid(), session.sessionToken, mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    it('should reject connections with invalid session tokens by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, nanoid(), mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    describe('with a valid session token', () => {
      it('should add a town listener, which should emit "newPlayer" to the socket when a player joins', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        await testingTown.addPlayer(player);
        expect(mockSocket.emit).toBeCalledWith('newPlayer', player);
      });
      it('should add a town listener, which should emit "playerMoved" to the socket when a player moves', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.updatePlayerLocation(player, generateTestLocation());
        expect(mockSocket.emit).toBeCalledWith('playerMoved', player);
      });
      it('should add a town listener, which should emit "playerDisconnect" to the socket when a player disconnects', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.destroySession(session);
        expect(mockSocket.emit).toBeCalledWith('playerDisconnect', player);
      });
      it('should add a town listener, which should emit "townClosing" to the socket and disconnect it when disconnectAllPlayers is called', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.disconnectAllPlayers();
        expect(mockSocket.emit).toBeCalledWith('townClosing');
        expect(mockSocket.disconnect).toBeCalledWith(true);
      });
      describe('when a socket disconnect event is fired', () => {
        it('should remove the town listener for that socket, and stop sending events to it', async () => {
          TestUtils.setSessionTokenAndTownID(
            testingTown.coveyTownID,
            session.sessionToken,
            mockSocket,
          );
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            const newPlayer = new Player('should not be notified');
            await testingTown.addPlayer(newPlayer);
            expect(mockSocket.emit).not.toHaveBeenCalledWith('newPlayer', newPlayer);
          } else {
            fail('No disconnect handler registered');
          }
        });
        it('should destroy the session corresponding to that socket', async () => {
          TestUtils.setSessionTokenAndTownID(
            testingTown.coveyTownID,
            session.sessionToken,
            mockSocket,
          );
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            mockReset(mockSocket);
            TestUtils.setSessionTokenAndTownID(
              testingTown.coveyTownID,
              session.sessionToken,
              mockSocket,
            );
            townSubscriptionHandler(mockSocket);
            expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
          } else {
            fail('No disconnect handler registered');
          }
        });
      });
      it('should forward playerMovement events from the socket to subscribed listeners', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        const mockListener = mock<CoveyTownListener>();
        testingTown.addTownListener(mockListener);
        // find the 'playerMovement' event handler for the socket, which should have been registered after the socket was connected
        const playerMovementHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'playerMovement',
        );
        if (playerMovementHandler && playerMovementHandler[1]) {
          const newLocation = generateTestLocation();
          player.location = newLocation;
          playerMovementHandler[1](newLocation);
          expect(mockListener.onPlayerMoved).toHaveBeenCalledWith(player);
        } else {
          fail('No playerMovement handler registered');
        }
      });
    });
  });
});
