import axios from "axios";

async function transaction() {

let chainName = "ethereum";
let tokenAddress = "0x190D2A4D4d24E54f103f14882c97703Ce75421Ea";
const query = new URLSearchParams({
    auth_key: 'nMeFvfwNMa57xbLeb0PPg3OjaYy44AG63b8Bqbwr'
  }).toString();
  
const response = await axios.get(`https://api.unmarshal.com/v3/${chainName}/address/${tokenAddress}/transactions?${query}`);

const data = response.data;
console.log("dataaaaaa", data);

}
transaction()