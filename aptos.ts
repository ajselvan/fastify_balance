import axios from "axios";

async function transaction() {

let chainName = "aptos";

let tokenAddress = '0x829faddf57a5a6c9f1563e5e3c643f9942039486a9b030517187c7baebd4fc87'; 

const response = await axios.get(`https://rpc.ankr.com/http/${chainName}/v1/accounts/${tokenAddress}/transactions`)
const data = response.data;

console.log("dataaaaaaaa", data);
}

transaction();
