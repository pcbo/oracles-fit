import Image from "next/image";

const clientID = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID ?? "";
const redirectURL = process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URL ?? "";

export default function Home() {
  const withingsURL = `https://account.withings.com/oauth2_user/authorize2?response_type=code&client_id=${clientID}&scope=user.info,user.metrics,user.activity&redirect_uri=${redirectURL}&state=1231kp23k12m`;

  console.log("Redirect url: ", redirectURL);
  console.log("Client ID: ", clientID);
  console.log("Withings URL: ", withingsURL);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex flex-col h-48 w-full items-center justify-center gap-2 bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <Image
            src="/git-fit-logo.png"
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
          <a href={withingsURL}>Log in with withings</a>
        </div>
      </div>
    </main>
  );
}
