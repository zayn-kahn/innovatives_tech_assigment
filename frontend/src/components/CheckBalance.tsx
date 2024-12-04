import { Button } from "react-bootstrap";
import { usdtConfig } from "../contract";
import { useReadContract } from "wagmi";
import { useState } from "react";
import { isAddress } from "viem";
import { formatAmount } from "../util";

function CheckBalance() {
  const [checkAddress, setCheckAddress] = useState("0xeth...geth");
  const { data: usdtBalance } = useReadContract({
    address: usdtConfig.address,
    abi: usdtConfig.abi,
    functionName: "balanceOf",
    args: [checkAddress as `0x${string}`],
    // @ts-ignore
    enabled: isAddress(checkAddress),
  });

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          value={checkAddress}
          onChange={(e) => {
            setCheckAddress(e.target.value);
          }}
          className="border border-gray-300 rounded"
          style={{
            height: "30px",
            width: "430px",
          }}
          placeholder="Enter address"
        />
        <Button
          variant="success"
        >
          {`Balance: ${formatAmount(usdtBalance, 6)}`}
        </Button>
      </div>
    </div>
  );
}

export default CheckBalance;
