export interface JoinTownResponse {
  coveyUserID: string,
  coveySessionToken: string,
  providerVideoToken: string,
  providerRoomID: string
}

export interface RoomLogin {
  emailId: string, 
  loginDate: Date,
  RoomName: string, 
  RoomId: string
}