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


// import * as mysql from "mysql";
// import axios from "axios";

// interface TransactionData {
//   version: string;
//   hash: string;
//   state_change_hash: string;
//   event_root_hash: string;
//   state_checkpoint_hash: string | null;
//   gas_used: string;
//   success: boolean;
//   vm_status: string;
//   accumulator_root_hash: string;
//   changes: Change[];
// }

// interface Change {
//   address: string;
//   state_key_hash: string;
//   data: ChangeData;
//   type: string;
// }

// interface ChangeData {
//   type: string;
//   data: any; // Adjust the type as per the actual structure of the "data" property
// }

// const chainName = "aptos";
// const userWalletAddress = "0x829faddf57a5a6c9f1563e5e3c643f9942039486a9b030517187c7baebd4fc87";

// async function fetchData(): Promise<TransactionData[]> {
//   try {
//     const response = await axios.get<TransactionData[]>(
//       `https://rpc.ankr.com/http/${chainName}/v1/accounts/${userWalletAddress}/transactions`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "kanalabs",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database:", err);
//     return;
//   }

//   console.log("Connected to the kanalabs database.");

//   const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS aptos (
//       version VARCHAR(255),
//       hash VARCHAR(255),
//       state_change_hash VARCHAR(255),
//       event_root_hash VARCHAR(255),
//       state_checkpoint_hash VARCHAR(255),
//       gas_used VARCHAR(255),
//       success BOOLEAN,
//       vm_status VARCHAR(255),
//       accumulator_root_hash VARCHAR(255),
//       address VARCHAR(255),
//       state_key_hash VARCHAR(255),
//       change_data JSON,
//       change_type VARCHAR(255)
//     )
//   `;

//   connection.query(createTableQuery, (err) => {
//     if (err) {
//       console.error("Error creating table:", err);
//       return;
//     }

//     console.log("Table 'aptos' created successfully.");

//     fetchData()
//       .then((data) => {
//         console.log("Fetched data successfully.");

//         // Flatten the data structure to insert into the database
//         const flattenedData: TransactionData[] = [];
//         data.forEach((transaction) => {
//           transaction.changes.forEach((change) => {
//             flattenedData.push({
//               version: transaction.version,
//               hash: transaction.hash,
//               state_change_hash: transaction.state_change_hash,
//               event_root_hash: transaction.event_root_hash,
//               state_checkpoint_hash: transaction.state_checkpoint_hash,
//               gas_used: transaction.gas_used,
//               success: transaction.success,
//               vm_status: transaction.vm_status,
//               accumulator_root_hash: transaction.accumulator_root_hash,
//               changes: [change],
//             });
//           });
//         });

//         const insertValuesQuery = `INSERT INTO aptos
//           (version, hash, state_change_hash, event_root_hash, state_checkpoint_hash, gas_used, success, vm_status, accumulator_root_hash, address, state_key_hash, change_data, change_type)
//           VALUES ?`;

//         const values = flattenedData.map((transaction) => [
//           transaction.version,
//           transaction.hash,
//           transaction.state_change_hash,
//           transaction.event_root_hash,
//           transaction.state_checkpoint_hash,
//           transaction.gas_used,
//           transaction.success,
//           transaction.vm_status,
//           transaction.accumulator_root_hash,
//           transaction.changes[0].address,
//           transaction.changes[0].state_key_hash,
//           JSON.stringify(transaction.changes[0].data),
//           transaction.changes[0].type,
//         ]);

//         connection.query(insertValuesQuery, [values], (err, result) => {
//           if (err) {
//             console.error("Error inserting values:", err);
//             return;
//           }

//           console.log("Values inserted successfully.");
//           console.log(result);

//           connection.end((err) => {
//             if (err) {
//               console.error("Error closing connection:", err);
//               return;
//             }

//             console.log("Connection closed.");
//           });
//         });
//       })
//       .catch((err) => {
//         console.error("Error fetching data:", err);
//         connection.end();
//       });
//   });
// });
