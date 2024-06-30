import { NextRequest } from "next/server";

const clientID = process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID ?? "";
const secretID = process.env.WITHINGS_SECRET_ID ?? "";
const redirectURL = process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URL ?? "";

export const GET = (request: NextRequest) => {
  console.log("Requesting scale data");
  const code = request.nextUrl.searchParams.get("code") ?? undefined;
  const url = "https://wbsapi.withings.net/v2/oauth2";
  const body = new URLSearchParams();
  body.append("action", "requesttoken");
  body.append("grant_type", "authorization_code");
  body.append("client_id", clientID);
  body.append("client_secret", secretID);
  body.append("code", code!);
  body.append("redirect_uri", redirectURL);

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-cache",
  })
    .then((response) => response.json())
    .then((data) => {
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
      const body = new URLSearchParams();
      body.append("action", "getmeas");
      body.append("meastypes", "1,6");
      body.append("category", "1");
      body.append(
        "startdate",
        Math.floor(startOfDay.getTime() / 1000).toString()
      );
      body.append("enddate", Math.floor(endOfDay.getTime() / 1000).toString());
      body.append("offset", "0");

      return fetch(urlForMeasurement, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${data.body.access_token}`,
        },
        body: body.toString(),
        cache: "no-cache",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from scale received");
          return Response.json({ ...data }, { status: 200 });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
