"use client";
import { useAccount } from "wagmi";
import { Reading } from "@/functions/measurements";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";
import { type Config, useConnectorClient } from "wagmi";
import { base } from "viem/chains";
import { useMemo } from "react";

function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export const ReadingEntry = ({ reading }: { reading: Reading }) => {
  const { address } = useAccount();
  const signer = useEthersSigner({ chainId: base.id });

  if (!address) return null;

  const createAttestation = async () => {
    if (!signer) return;

    const eas = new EAS("0x4200000000000000000000000000000000000021");
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "uint256 weight, uint256 date_of_measurement"
    );
    const date = new Date(reading.date_of_reading);
    const dataToEnconde = [
      { name: "weight", value: BigInt(reading.weight_kg), type: "uint256" },
      {
        name: "date_of_measurement",
        value: BigInt(date.getTime()),
        type: "uint256",
      },
    ];
    const encodedData = schemaEncoder.encodeData(dataToEnconde);

    const schemaUID =
      "0xc954dc973cc7e7aefbdf245dd90ca2af522d32d487a1fcb8f47200cf61138b82";

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: BigInt(0),
        revocable: true,
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);

    alert(`Attestation created! 🎉 ${newAttestationUID}`);
  };

  return (
    <div key={reading.id} className="flex flex-row justify-between">
      <p>{reading.weight_kg / 1000000} kg</p>
      <p>{reading.date_of_reading}</p>
      <button onClick={() => createAttestation()}>Attest</button>
    </div>
  );
};
