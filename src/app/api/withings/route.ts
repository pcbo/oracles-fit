import { NextRequest } from "next/server";
import { createUserOrFindUserByWallet } from "@/app/functions/users";
import { createReadingForUser } from "@/app/functions/measurements";

const clientID = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID ?? "";
const secretID = process.env.WITHINGS_SECRET_ID ?? "";
const redirectURL = process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URL ?? "";

export const maxDuration = 60;
export const GET = async (request: NextRequest) => {
  console.log("Requesting scale data");
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const wallet = request.nextUrl.searchParams.get("state") ?? undefined;

  const url = "https://wbsapi.withings.net/v2/oauth2";
  const body = new URLSearchParams();
  body.append("action", "requesttoken");
  body.append("grant_type", "authorization_code");
  body.append("client_id", clientID);
  body.append("client_secret", secretID);
  body.append("code", code!);
  body.append("redirect_uri", redirectURL);

  const request_auth_token = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-cache",
  });

  const data = await request_auth_token.json();
  console.log("Authorization received");
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
    0,
    0,
    0
  ); // Start of current day
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  ); // End of current day
  const urlForMeasurement = "https://wbsapi.withings.net/measure";
  const bodyForMeasurement = new URLSearchParams();
  bodyForMeasurement.append("action", "getmeas");
  bodyForMeasurement.append("meastypes", "1,6");
  bodyForMeasurement.append("category", "1");
  bodyForMeasurement.append(
    "startdate",
    Math.floor(startOfDay.getTime() / 1000).toString()
  );
  bodyForMeasurement.append(
    "enddate",
    Math.floor(endOfDay.getTime() / 1000).toString()
  );
  bodyForMeasurement.append("offset", "0");

  const request_measurement = await fetch(urlForMeasurement, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${data.body.access_token}`,
    },
    body: bodyForMeasurement.toString(),
    cache: "no-cache",
  });

  const measurement_data = await request_measurement.json();
  console.log("Data from scale received");
  const user = await createUserOrFindUserByWallet(wallet!);

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  console.log("User created or found: ", user.id);
  const readingData = {
    weight: measurement_data.body.measuregrps[0].measures[0].value,
    date: new Date(measurement_data.body.measuregrps[0].date * 1000),
  };

  const reading = await createReadingForUser(user!, readingData);

  return Response.json({ user, reading }, { status: 200 });
};
