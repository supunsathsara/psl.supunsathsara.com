import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request): Promise<Response> {
  const healthCheck = {
    message: "OK",
    timestamp: Date.now(),
    database: "unknown",
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("events")
      .select("id")
      .limit(1)
      .single();

    if (error) {
      return new Response(JSON.stringify({ message: "Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (data) {
      healthCheck.database = "online";
    }
    return new Response(JSON.stringify(healthCheck), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}