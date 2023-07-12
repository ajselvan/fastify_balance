import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const runApp = async () => {
  await Moralis.start({
    apiKey: "Yk9JAz74BHpIUkL8eZTBFaOHgyZQLRSr9iHggLy0odzY6Dbq6ceovo8HjLXWHjM8",
  });

  const address = "0x43148EAf7b36d8ee1760D20F9f020e4507648D84";

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    address,
    chain,
  });

  console.log(response.toJSON());
};

runApp();