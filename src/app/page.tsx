import Image from "next/image";
import { WithingsConectButton } from "@/components/withings-connect-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col h-48 w-full items-center justify-center gap-2">
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
          <w3m-button />
          <WithingsConectButton />
        </div>
      </div>
    </main>
  );
}
