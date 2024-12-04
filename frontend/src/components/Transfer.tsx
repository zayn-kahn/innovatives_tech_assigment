import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Address, BaseError, isAddress, parseUnits } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteContract } from "wagmi";
import { logError } from "../util";
import { usdtConfig } from "../contract";

function Transfer() {
  const [toAddress, setToAddress] = useState("0x123");
  const [toAmount, setToAmount] = useState("0.01");
  const { data, isPending, writeContractAsync } = useWriteContract();

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 3,
  });

  const handleTransfer = async () => {
    try {
      await writeContractAsync({
        address: usdtConfig.address,
        abi: usdtConfig.abi,
        functionName: "transfer",
        args: [toAddress as Address, parseUnits(`${toAmount}`, 6)],
        // @ts-ignore
        enabled: isAddress(toAddress) || toAmount > 0,
      });
      toast.info(`Transfer Tx sent`);
    } catch (e) {
      const error = e as BaseError;
      logError(error, "Transfer Tx sending Failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(`${toAmount} Simple ERC20 transferred to ${toAddress} `);
    }
  }, [isSuccess]);

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
          value={toAddress}
          onChange={(e) => {
            setToAddress(e.target.value);
          }}
          className="border border-gray-300 rounded"
          style={{
            height: "30px",
            width: "430px",
          }}
          placeholder="Enter address"
        />
        <input
          type="number"
          value={toAmount}
          onChange={(e) => {
            setToAmount(e.target.value);
          }}
          className="border border-gray-300 rounded"
          style={{
            height: "30px",
            width: "430px",
          }}
          placeholder="Enter amount"
        />
        <Button
          style={{
            height: "35px",
            width: "150px",
          }}
          onClick={() => handleTransfer()}
          variant="success"
        >
          <span>
            {!isPending && !isLoading && `Transfer`}
            {isPending && !isLoading && `Sign Tx ...`}
            {!isPending && isLoading && `Waiting for tx...`}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default Transfer;
