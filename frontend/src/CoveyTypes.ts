import { Socket } from 'socket.io-client';
import Player, { UserLocation } from './classes/Player';
import TownsServiceClient from './classes/TownsServiceClient';
import UserServiceClient from './classes/UserServiceClient';

export type CoveyEvent = 'playerMoved' | 'playerAdded' | 'playerRemoved';

export type VideoRoom = {
  twilioID: string,
  id: string
};
export type UserProfile = {
  displayName: string,
  id: string
};
export type NearbyPlayers = {
  nearbyPlayers: Player[]
};
export type CoveyAppState = {
  sessionToken: string,
  userName: string,
  currentTownFriendlyName: string,
  currentTownID: string,
  currentTownIsPubliclyListed: boolean,
  myPlayerID: string,
  players: Player[],
  currentLocation: UserLocation,
  nearbyPlayers: NearbyPlayers,
  emitMovement: (location: UserLocation) => void,
  socket: Socket | null,
  apiClient: TownsServiceClient,
};

export type UserAppState = {
  username: string,
  socket: Socket | null,
  apiClient: UserServiceClient,
};