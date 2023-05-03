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

  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState(null);

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
    hash: writeData?.hash,

    onError(error) {
      console.log(`Error: {error}`);
    },

    onSuccess(data) {
      console.log(`Successful`);
    },
  });

  return (
    <div className="App">
      <header className="flex justify-end py-[1rem]">
        <ConnectButton />
      </header>
      <main>
        <div className="flex flex-col bg-gradient-to-tr from-cyan-300 to-cyan-100 w-[50%] mx-auto py-8 rounded-md font-mono">
          <h1 className="text-2xl font-bold">User Details</h1>
          <p>User's Address: {address}</p>
          <p>Token Name: {data}</p>
          <p>
            Total Balance: {String(readData?.[0] / 10 ** 18) ?? "0"}{" "}
            {readData?.[2]}
          </p>
          <p>Total Supply: {String(readData?.[3] / 10 ** 18) ?? "0"}</p>
          <p>Owner: {readData?.[1]}</p>
        </div>

        <form
          onSubmit={handleChange}
          className="mt-[3rem] border border-black w-[30%] mx-auto py-10 rounded-lg flex flex-col items-center"
        >
          <label htmlFor="address">Address: </label>
          <input
            className="border border-2 border-gray-500 p-2 rounded-md"
            type="text"
            id="address"
            placeholder="Address to mint tokens"
            onChange={(e) => setAccount(e.target.value)}
            value={account}
          />
          <br />
          <label htmlFor="amount">Amount: </label>
          <input
            className="border border-2 border-gray-500 p-2 rounded-md"
            type="text"
            id="amount"
            placeholder="Amount of tokens"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <br />
          <button
            className="p-4 outline-none rounded-md"
            type="submit"
            disabled={!account || !amount}
            style={
              !account || !amount
                ? { backgroundColor: "grey", color: "black" }
                : { backgroundColor: "green", color: "white" }
            }
          >
            {writeLoading || waitLoading ? "Submitting" : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
