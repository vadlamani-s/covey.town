import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import addTownRoutes from './router/towns';
import addAuthRoutes from './router/auth';
import CoveyTownsStore from './lib/CoveyTownsStore';

config();

const app = Express();
app.use(CORS());
const server = http.createServer(app);

const db = process.env.DB_URL;
mongoose
  .connect(db as string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo Connected...'  ))
  .catch((err) => console.log(err));

addTownRoutes(server, app);
addAuthRoutes(app);

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    const newTown = CoveyTownsStore.getInstance()
      .createTown(process.env.DEMO_TOWN_ID, false);
  }
});
