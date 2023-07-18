import { MongoClient } from 'mongodb';
import axios from 'axios';

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'kanalabs';
const collectionName = 'transactions';

async function createDatabaseAndCollection(userWalletAddress: string) {
  const client = new MongoClient(url);

  try {
    //await client.connect();

    console.log('Connected to the database');

    const db = client.db(dbName);

    //await db.createCollection(collectionName);

    console.log('Database and collection created successfully');

    const query = new URLSearchParams({
      page: '1',
      auth_key: 'nMeFvfwNMa57xbLeb0PPg3OjaYy44AG63b8Bqbwr'
    }).toString();

    const chainName1 = 'solana';
    const userWalletaddress1 = 'DZVJiLoivwSSNah5cSbH1Mo78W3oUL1bRMsDZsy7AcH9';

    const response1 = await axios.get(`https://api.unmarshal.com/v3/${chainName1}/address/${userWalletaddress1}/transactions?${query}`);
    const data1 = response1.data;
    const transactionsArray1 = data1.transactions;

    const chainName2 = 'aptos';
    const userWalletaddress2 = '0x9538c839fe490ccfaf32ad9f7491b5e84e610ff6edc110ff883f06ebde82463d';

    const response2 = await axios.get(`https://rpc.ankr.com/http/${chainName2}/v1/accounts/${userWalletaddress2}/transactions`);
    const data2 = response2.data;

    const chainName3 = 'matic';
    const userWalletaddress3 = '0xc5b5cc138bc5376b05b5490a7cec894ac68e6249';

    const response3 = await axios.get(`https://api.unmarshal.com/v3/${chainName3}/address/${userWalletaddress3}/transactions?${query}`);
    const data3 = response3.data;
    const transactionsArray3 = data3.transactions;

    const chainName4 = 'ethereum';
    const userWalletaddress4 = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

    const response4 = await axios.get(`https://api.unmarshal.com/v3/${chainName4}/address/${userWalletaddress4}/transactions?${query}`);
    const data4 = response4.data;
    const transactionsArray4 = data4.transactions;

    const chainName5 = 'bsc';
    const userWalletaddress5 = '0xd1d6bf74282782b0b3eb1413c901d6ecf02e8e28';

    const response5 = await axios.get(`https://api.unmarshal.com/v3/${chainName5}/address/${userWalletaddress5}/transactions?${query}`);
    const data5 = response5.data;
    const transactionsArray5 = data5.transactions;

    const chainName6 = 'klaytn';
    const userWalletaddress6 = '0x97740ea318e655722fa74e5eecc7694d6871e18b';

    const response6 = await axios.get(`https://api.unmarshal.com/v3/${chainName6}/address/${userWalletaddress6}/transactions?${query}`);
    const data6 = response6.data;
    const transactionsArray6 = data6.transactions;

    const collection = db.collection(collectionName);
    await collection.updateMany(
      {},
      {
        $set: {
          address: userWalletAddress,
          "TxnHistory.solana": transactionsArray1,
          "TxnHistory.aptos": data2,
          "TxnHistory.matic": transactionsArray3,
          "TxnHistory.ethereum": transactionsArray4,
          "TxnHistory.bsc": transactionsArray5,
          "TxnHistory.klaytn": transactionsArray6,
          lastCalled: new Date()
        },
      },
      { upsert: true }
    );

    console.log('Data inserted into MongoDB');
  } catch (error) {
    console.error('Error creating database and collection:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

const myWalletAddress = '0x97a57d9CE2889E2E8DFb6019f8Eb51F5d119Bde3'; // Replace with your actual wallet address
createDatabaseAndCollection(myWalletAddress);
