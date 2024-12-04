import { Button } from "react-bootstrap";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContract,
} from "wagmi";
import Mint from "./components/Mint";
import { formatAmount } from "./util";
import { truncateAddress } from "./util";
import { usdtConfig } from "./contract";
import CheckBalance from "./components/CheckBalance";
import Transfer from "./components/Transfer";

function App() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: ethBalance,
  } = useBalance({
    address: address,
  });

  const {
    data: usdtBalance,
  } = useReadContract({
    address: usdtConfig.address,
    abi: usdtConfig.abi,
    functionName: "balanceOf",
    // @ts-ignore
    args: [address],
    enabled: isConnected,
  });

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#111",
          padding: "20px",
        }}
      >
        <div
          style={{
            color: "white",
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
          }}
        >
          {address && (
            <div
              style={{
                background: "#222",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "20px",
                maxWidth: "600px",
                margin: "0 auto 20px",
              }}
            >
              <h3 style={{ color: "#999", marginBottom: "15px" }}>
                Account Info
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: "#333",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ color: "#999", fontSize: "12px" }}>Address</div>
                  <div>{truncateAddress(address)}</div>
                </div>
                <div
                  style={{
                    background: "#333",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ color: "#999", fontSize: "12px" }}>
                    ETH Balance
                  </div>
                  <div>{formatAmount(ethBalance?.value, 18)}</div>
                </div>
                <div
                  style={{
                    background: "#333",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ color: "#999", fontSize: "12px" }}>
                    USDT Balance
                  </div>
                  <div>{formatAmount(usdtBalance, 6)}</div>
                </div>
              </div>
            </div>
          )}

          {!isConnected && (
            <div style={{ marginTop: "20px" }}>
              {connectors.map((connector) => (
                <Button
                  key={connector.uid}
                  variant="light"
                  onClick={() => connect({ connector })}
                  type="button"
                  style={{
                    margin: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                  }}
                >
                  Connect with {connector.name}
                </Button>
              ))}
              {error?.message && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  {error.message}
                </p>
              )}
            </div>
          )}

          {isConnected && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Mint />
              <CheckBalance />
              <Transfer />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => disconnect()}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    width: "120px",
                    background: "#dc3545",
                    border: "none",
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
