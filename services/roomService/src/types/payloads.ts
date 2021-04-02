export interface JoinTownResponse {
  coveyUserID: string,
  coveySessionToken: string,
  providerVideoToken: string,
  providerRoomID: string
}

export interface RoomLogin {
  emailId?: string, 
  loginDate?: Date,
  friendlyName: string, 
  coveyTownID: string,
  userName: string
}

export interface LogListResponse {
  logs: RoomLogin[]
}