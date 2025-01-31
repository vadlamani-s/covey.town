import CORS from 'cors';
import { config } from 'dotenv';
import Express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import { AddressInfo } from 'net';
import CoveyTownsStore from './lib/CoveyTownsStore';
import addAuthRoutes from './router/auth';
import addTownRoutes from './router/towns';

config();

const app = Express();
const uiServerOrigin = process.env.UI_SERVER_ORIGIN || 'http://localhost:3000';
app.use(CORS({ origin: uiServerOrigin, credentials: true }));
const server = http.createServer(app);

let database: mongoose.Connection;
export default function connect(): void {
  const uri = process.env.MONGODB_URI as string;

  if (database) {
    return;
  }

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  database = mongoose.connection;

  database.once('open', async () => {
    // eslint-disable-next-line no-console
    console.log('Connected to Database');
  });
  database.on('error', () => {
    // eslint-disable-next-line no-console
    console.log('Disconnected');
  });
}

connect();

addAuthRoutes(app);
addTownRoutes(server, app);

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    CoveyTownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false);
  }
});
