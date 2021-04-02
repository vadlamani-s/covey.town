import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';
import { ServerPlayer } from './Player';

export interface UserLoginRequest {
    emailId: string;
    password: string;
}

export interface UserLoginResponse {
    emailId: string;
    password: string;
    creationDate: Date;
}

export interface UserLogoutRequest {
    userSessionData: string;
}
  
export interface UserLogoutResponse {
    emailId: string;
    password: string;
    creationDate: Date;
}

export interface UserRegisterRequest {
    emailId: string;
    password: string;
    name: string;
    creationDate: Date;
}

export interface UserRegisterResponse {
    emailId: string;
    name: string;
    creationDate: Date;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}


export default class UserServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Towns Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(response: AxiosResponse<ResponseEnvelope<T>>, ignoreResponse = false): T {
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {} as T;
      }
      assert(response.data.response);
      return response.data.response;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  async loginUser(requestData: UserLoginRequest): Promise<UserLoginResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<UserLoginResponse>>('/auth/loginUser', requestData);
    return UserServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async logoutUser(requestData: UserLogoutRequest): Promise<UserLogoutResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<UserLoginResponse>>('/auth/logoutUser', requestData);
    return UserServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async registerUser(requestData: UserRegisterRequest): Promise<UserRegisterResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<UserRegisterResponse>>('/auth/registerUser', requestData);
    return UserServiceClient.unwrapOrThrowError(responseWrapper);
  }

}
