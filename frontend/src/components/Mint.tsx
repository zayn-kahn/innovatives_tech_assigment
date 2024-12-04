import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { BaseError } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteContract } from "wagmi";
import { logError } from "../util";
import { usdtConfig } from "../contract";

function Mint() {
  const { data, isPending, writeContractAsync } = useWriteContract();

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 3,
  });

  const handleMint = async () => {
    try {
      await writeContractAsync({
        // @ts-ignore
        address: usdtConfig.address,
        abi: usdtConfig.abi,
        // @ts-ignore
        functionName: "mint",
      });
      toast.info(`Mint Tx sent`);
    } catch (e) {
      const error = e as BaseError;
      logError(error, "Mint Failed");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("1000 Simple ERC20 minted");
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={handleMint}
        variant="primary"
        style={{
          height: "35px",
          width: "150px",
        }}
        disabled={isPending || isLoading}
      >
        <span>
          {!isPending && !isLoading && `Mint USDT`}
          {isPending && !isLoading && `Minting USDT...`}
          {!isPending && isLoading && `Waiting for tx...`}
        </span>
      </Button>
    </div>
  );
}

export default Mint;
