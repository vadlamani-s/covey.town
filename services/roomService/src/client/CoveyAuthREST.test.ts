import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { AddressInfo } from 'net';
import addAuthRoutes from '../router/auth';
import User from '../types/User';
import TownsServiceClient from './TownsServiceClient';

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
  });
});
