import { init } from '@instantdb/node';

const db = init({
  appId: process.env.INSTANTDB_APP_ID,
  token: process.env.INSTANTDB_TOKEN
});

export default db;
