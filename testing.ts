import * as mysql from "mysql";
import axios from "axios";

interface Transaction {
  id: string;
  from: string;
  to: string;
  fee: string;
  gas_price: string;
  gas_limit: string;
  gas_used: string;
  contract_address: string;
  date: number;
  status: string;
  type: string;
  block: number;
  value: string;
  nonce: number;
  native_token_decimals: number;
  description: string;
  sent: any[];
  input_data: string;
}

interface APIResponse {
  transactions: Transaction[];
}

const chainName = "matic";
const userWalletAddress = "0x97a57d9CE2889E2E8DFb6019f8Eb51F5d119Bde3";
const query = new URLSearchParams({
  page: '1',
  auth_key: 'nMeFvfwNMa57xbLeb0PPg3OjaYy44AG63b8Bqbwr'
}).toString();

async function fetchData(): Promise<APIResponse> {
  const response = await axios.get(`https://api.unmarshal.com/v3/${chainName}/address/${userWalletAddress}/transactions?${query}`);
  return response.data as APIResponse;
}

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kanalabs",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }

  console.log("Connected to the kanalabs database.");

  // Create a table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS testing (
      id INT PRIMARY KEY AUTO_INCREMENT,
      transaction_id VARCHAR(255),
      from_address VARCHAR(255),
      to_address VARCHAR(255),
      fee VARCHAR(255),
      gas_price VARCHAR(255),
      gas_limit VARCHAR(255),
      gas_used VARCHAR(255),
      contract_address VARCHAR(255),
      date INT,
      status VARCHAR(255),
      type VARCHAR(255),
      block INT,
      value VARCHAR(255),
      nonce INT,
      native_token_decimals INT,
      description VARCHAR(255),
      sent VARCHAR(255),
      input_data VARCHAR(255)
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }

    console.log("Table 'matic' created successfully.");

    fetchData().then((data) => {
      // Insert values into the table
      const insertValuesQuery = `
        INSERT INTO testing (
          transaction_id,
          from_address,
          to_address,
          fee,
          gas_price,
          gas_limit,
          gas_used,
          contract_address,
          date,
          status,
          type,
          block,
          value,
          nonce,
          native_token_decimals,
          description,
          sent,
          input_data
        )
        VALUES ?
      `;

      console.log("transactions of data", data.transactions);

      const values = data.transactions.map((transaction) => [
        transaction.id,
        transaction.from,
        transaction.to,
        transaction.fee,
        transaction.gas_price,
        transaction.gas_limit,
        transaction.gas_used,
        transaction.contract_address,
        transaction.date,
        transaction.status,
        transaction.type,
        transaction.block,
        transaction.value,
        transaction.nonce,
        transaction.native_token_decimals,
        transaction.description,
        JSON.stringify(transaction.sent),
        transaction.input_data
      ]);

      connection.query(insertValuesQuery, [values], (err,result) => {
        if (err) {
          console.error("Error inserting values:", err);
          return;
        }

        console.log("Values inserted successfully.");
        console.log(result);

        // Close the connection
        connection.end((err) => {
          if (err) {
            console.error("Error closing connection:", err);
            return;
          }

          console.log("Connection closed.");
        });
      });
    }).catch((err) => {
      console.error("Error fetching data:", err);
      connection.end();
    });
  });
});
