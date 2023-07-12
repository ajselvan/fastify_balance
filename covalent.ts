import axios from "axios";

async function transaction() {
  const walletName = "eth-mainnet";
  const tokenAddress = "0x190D2A4D4d24E54f103f14882c97703Ce75421Ea";
  const headers = {
    Authorization: "Bearer cqt_rQ9KPqtHh6HhVvMx7MWxkQ7bQMTX",
  };

  const page = 0;

  try {
    const response = await axios.get(
      `https://api.covalenthq.com/v1/${walletName}/address/${tokenAddress}/transactions_v3/page/${page}/`,
      { headers: headers }
    );

    const data = response.data;
    console.log("dataaaaaa", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

transaction();

//hash 

// `https://api.covalenthq.com/v1/{walletName}/transaction_v2/{txHash}/`

// summary transaction

// `https://api.covalenthq.com/v1/${walletName}/address/${tokenAddress}/transactions_summary/`,

//  Earliest transaction

// `https://api.covalenthq.com/v1/${walletName}/bulk/transactions/${tokenAddress}/`,

//  Recent transaction

// `https://api.covalenthq.com/v1/${walletName}/address/${tokenAddress}/transactions_v3/`,

// page 

// `https://api.covalenthq.com/v1/${walletName}/address/${tokenAddress}/transactions_v3/page/${page}/`,




