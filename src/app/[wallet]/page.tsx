import Image from "next/image";
import { retrieveMeasuresForWallet } from "@/functions/users";
import { ethers } from "ethers";

const RPC_URL = process.env.RPC_URL ?? "";

export default async function WalletPage({
  params,
}: {
  params: { wallet: string };
}) {
  const wallet = params.wallet.toLowerCase() as `0x${string}`;
  const readings = await retrieveMeasuresForWallet(wallet);
  // const provider = new ethers.providers.JsonRpcProvider(RPC_URL, "mainnet");

  // console.log(provider);
  // console.log(RPC_URL);
  // const name = await provider.lookupAddress(wallet);

  // const officialName = name ? name : wallet;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col h-48 w-full items-center justify-center gap-2 bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Image
            src="/oracles-logo.png"
            alt="Get Fit Logo"
            className="rounded-full border border-white"
            width={100}
            height={24}
            priority
            style={{ marginBottom: "10px" }}
          />
          <p className="text-2xl">$GETFIT</p>
          <p>Onchain accountability for your weight loss journey.</p>

          {!readings || (readings.length === 0 && <p>No readings yet.</p>)}
          {readings && readings.length > 0 && (
            <div className="flex flex-col gap-4 mt-8">
              <p>{wallet} has the following readings:</p>
              {readings.map((reading) => (
                <div key={reading.id} className="flex flex-row justify-between">
                  <p>{reading.weight_kg / 1000000} kg</p>
                  <p>{reading.date_of_reading}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
