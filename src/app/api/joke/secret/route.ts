import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = request.headers.get("api-key");

  if (apiKey === "api101") {
    // Send a secret joke
    return NextResponse.json({ joke: "Why did the chicken cross the road? To get to the other side!" });
  } else {
    // Send unauthorized response
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
  