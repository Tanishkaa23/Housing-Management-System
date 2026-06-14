import dns from 'dns';
import { MongoClient } from 'mongodb';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri =
  'mongodb+srv://tanishkagupta203_db_user:PuDhwKA1f6KfndhG@housingmanagement.cq0n9dj.mongodb.net/';

const client = new MongoClient(uri);

try {
  await client.connect();

  console.log('CONNECTED SUCCESSFULLY');

  await client.close();
} catch (err) {
  console.log(err);
}