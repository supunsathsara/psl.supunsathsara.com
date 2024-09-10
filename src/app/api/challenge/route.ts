import { supabase } from "@/utils/supabase/serviceUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("api-key");

    const { name, email, github } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name, Email are required" },
        { status: 400 }
      );
    }

    if (apiKey === process.env.CHALLENGE_ANSWER) {
      const { data, error } = await supabase
        .from("winners")
        .insert([{ name, email, github }]);

      if (error && error.code === "23505") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      //send a congratulatory message'
      return NextResponse.json({
        message: "Congratulations! You are a correct!!",
      });
    } else {
      // Send unauthorized response
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
