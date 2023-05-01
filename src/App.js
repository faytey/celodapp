import logo from "./logo.svg";
import "./App.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { token } from "./contractInfo.js";

function App() {
  const { address } = useAccount();

  const [account, setAccount] = useState("0x0");
  const [amount, setAmount] = useState(0);

  const { data } = useContractRead({
    address: token.address,
    abi: token.abi,
    functionName: "name",
  });

  const {
    data: readData,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      {
        address: token.address,
        abi: token.abi,
        functionName: "balanceOf",
        args: [address ?? "0x0"],
      },
      {
        address: token.address,
        abi: token.abi,
        functionName: "owner",
      },
      {
        address: token.address,
        abi: token.abi,
        functionName: "symbol",
      },
      {
        address: token.address,
        abi: token.abi,
        functionName: "totalSupply",
      },
    ],
  });

  const handleChange = (e) => {
    e.preventDefault();
    write?.();
  };

  const { config } = usePrepareContractWrite({
    address: token.address,
    abi: token.abi,
    functionName: "mint",
    args: [address, amount],
  });
  const {
    data: writeData,
    isLoading: writeLoading,
    isSuccess,
    write,
  } = useContractWrite(config);

  const {
    data: waitData,
    isError: waitError,
    isLoading: waitLoading,
  } = useWaitForTransaction({
    hash: "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060",
  });

  return (
    <div className="App">
      <header>
        <ConnectButton />
      </header>
      <main>
        <p>User's Address: {address}</p>
        <p>Token Name: {data}</p>
        <p>
          Total Balance: {String(readData?.[0] / 10 ** 18) ?? "0"}{" "}
          {readData?.[2]}
        </p>
        <p>Total Supply: {String(readData?.[3] / 10 ** 18) ?? "0"}</p>
        <p>Owner: {readData?.[1]}</p>

        <form onChange={handleChange}>
          <label htmlFor="address">Address: </label>
          <input
            type="text"
            id="address"
            placeholder="Address to mint tokens"
            onChange={(e) => setAccount(e.target.value)}
            value={account}
          />
          <br />
          <label htmlFor="amount">Amount: </label>
          <input
            type="text"
            id="amount"
            placeholder="Amount of tokens"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <br />
          <button type="submit">
            {writeLoading ? "Submitting" : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
