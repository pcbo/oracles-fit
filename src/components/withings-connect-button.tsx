"use client";
import { useAccount } from "wagmi";

const clientID = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID ?? "";
const redirectURL = process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URL ?? "";

export const WithingsConectButton = () => {
  const { address } = useAccount();

  if (!address) return null;

  const withingsURL = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientID}&scope=user.info,user.metrics,user.activity&redirect_uri=${redirectURL}&state=${address}`;

  return <a href={withingsURL}>Log in with withings</a>;
};
