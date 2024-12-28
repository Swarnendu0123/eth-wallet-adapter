import { useState } from "react";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  http,
  createConfig,
  WagmiProvider,
  useAccount,
  useBalance,
  useSendTransaction,
} from "wagmi";
import { useConnect } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <EthSend />
        <br />
        ______________________________________
        <br />
        <WalletOptions />
        <br />
        ______________________________________
        <br />
        <MyAddress />
        <br />
        ______________________________________
        <br />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

function MyAddress() {
  const { address } = useAccount();
  const { balance } = useBalance({ address });

  return (
    <div>
      <h3>Address: {address}</h3>
      <p>Balance: {balance?.data?.formatted}</p>
    </div>
  );
}

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}

function EthSend() {
  const { data: hash, sendTransaction } = useSendTransaction();
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const sendEtherium = () => {
    sendTransaction({
      to: receiverAddress,
      value: (1000000000000000000 * amount).toString(),
    });
  };

  
  

  return (
    <div>
      <input
        type="text"
        placeholder="Receiver Address"
        onChange={(e) => setReceiverAddress(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Amount of ETH"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <button onClick={sendEtherium}>Send</button>
    </div>
  );
}

export default App;
