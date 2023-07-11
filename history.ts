import axios from "axios";

async function transaction() {
    
let chainName = "ethereum";
let tokenAddress = "0x43148EAf7b36d8ee1760D20F9f020e4507648D84";
const query = new URLSearchParams({

    auth_key: 'nMeFvfwNMa57xbLeb0PPg3OjaYy44AG63b8Bqbwr'
  }).toString();
  
const response = await axios.get(`https://api.unmarshal.com/v3/${chainName}/address/${tokenAddress}/transactions?${query}`);

const data = response.data;
console.log("dataaaaaa", data);

}
transaction()