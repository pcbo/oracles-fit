import { ImageResponse } from "next/og";
import { retrieveMeasuresForWallet } from "@/functions/users";

export const runtime = "edge";

export default async function Image({
  params,
}: {
  params: { wallet: string };
}) {
  const readings = await retrieveMeasuresForWallet(params.wallet.toLowerCase());

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex w-full">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span tw="text-indigo-600">$GETFIT</span>
              {readings && readings.length > 0 && (
                <span>
                  {params.wallet} latest reading was{" "}
                  {readings[0].weight_kg / 1000000} kg.
                </span>
              )}
              <span tw="mt-8">
                Start your accountability journey at oracles.fit!
              </span>
            </h2>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}
