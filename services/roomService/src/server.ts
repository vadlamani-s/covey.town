import Express from 'express';
import * as http from 'http';
import CORS from 'cors';
import { AddressInfo } from 'net';
import { config } from 'dotenv';
// import * as mongoose from 'mongoose';
import mongoose from 'mongoose';
import addTownRoutes from './router/towns';
import {addAuthRoutes} from './router/auth';
import CoveyTownsStore from './lib/CoveyTownsStore';



config();

const app = Express();
app.use(CORS());
const server = http.createServer(app);

let database: mongoose.Connection;
const connect = () => {
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
    console.log('Connected to database');
  });
  database.on('error', () => {
    console.log('Error connecting to database');
  });
};

// const db = process.env.DB_URL;
// mongoose
//   .connect(db as string, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Mongo Connected...'  ))
//   .catch((err) => console.log(err));

connect();

addAuthRoutes(app);
addTownRoutes(server, app);

server.listen(process.env.PORT || 8081, () => {
  const address = server.address() as AddressInfo;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${address.port}`);
  if (process.env.DEMO_TOWN_ID) {
    const newTown = CoveyTownsStore.getInstance()
      .createTown(process.env.DEMO_TOWN_ID, false);
  }
});
